const assert = require('assert');
const predicate = require('is-predicate');

const POSITIVE_PREDICATE = predicate;
const NEGATIVE_PREDICATE = predicate.not;

function isObject(obj) {
    return typeof obj === 'object' && obj !== null
}

function check(refVal, refRule, predicator = predicate, condition = Array.prototype.every) {
    if (refVal === undefined)
        return false;
    if (isObject(refRule)) {
        // Complicated rule - like { greater then 10 }
        return condition.call(Object.keys(refRule), (p) => {
            let comparable = refRule[p];
            if (isObject(comparable) || p === "not") {
                if (p === "or") {
                    return check(refVal, comparable, predicator, Array.prototype.some);
                } else if (p === "not") {
                    let oppositePredicator = predicator === NEGATIVE_PREDICATE ? POSITIVE_PREDICATE : NEGATIVE_PREDICATE;
                    return check(refVal, comparable, oppositePredicator, Array.prototype.every);
                } else {
                    return check(refVal, comparable, predicator[p], Array.prototype.every);
                }
            } else {
                return predicator[p](refVal, comparable);
            }
        });
    }  else {
        // Simple rule - like emptyString
        return predicator[refRule](refVal);
    }
}


describe('Check', function() {
    describe('singleLine', function() {
        it('empty check', function() {
            assert.equal(check("", "empty"), true);
            assert.equal(check(" ", "empty"), false);
        });
        it('NOT empty check', function() {
            assert.equal(check("", { "not": "empty" }), false);
            assert.equal(check(" ", { "not": "empty" }), true);
        });
    });
    describe('composite', function() {
        it('greater', function() {
            assert.equal(check(10, { "greater": 5 }), true);
            assert.equal(check(10, { "greater": 15 }), false);
        });
        it('NOT greater', function() {
            assert.equal(check(10, { "not" : { "greater": 5 } }), false);
            assert.equal(check(10, { "not" : { "greater": 15 } }), true);
        });
    });
    describe('and', function() {
        it("> 5 && < 12", function() {
            assert.equal(check(10, { "greater": 5 }), true);
            assert.equal(check(10, { "less": 12 }), true);
            assert.equal(check(10, { "greater": 5, "less": 12 }), true);
            assert.equal(check(15, { "greater": 5, "less": 12 }), false);
        });

        it("> 5 && < 12", function() {
            assert.equal(check(10, { "not" : { "greater": 5 } }), false);
            assert.equal(check(10, { "not" : { "less": 12 } }), false);
            assert.equal(check(10, { "not" : { "greater": 5, "less": 12 } }), false);
            assert.equal(check(15, { "not" : { "greater": 5, "less": 12 } }), false);
        });
    });
    describe('or', function() {
        let rule = { "or": { "less": 5, "greater": 12 } };
        it("< 5 || > 12", function() {
            assert.equal(check(1, rule), true);
            assert.equal(check(8, rule), false);
            assert.equal(check(15, rule), true);
        });
    });
    describe('not', function() {
        it('NOT empty check', function() {
            assert.equal(check("", { "not": "empty" }), false);
            assert.equal(check(" ", { "not": "empty" }), true);
        });
        it('double negation', function() {
            assert.equal(check("", { "not": { "not": "empty" } }), true);
            assert.equal(check(" ", { "not": { "not": "empty" } }), false);
        });
    })

});