var assert = require('assert');
var predicate = require('is-predicate');

function isObject(obj) {
    return typeof obj === 'object' && obj !== null
}

function check(refVal, refRule, predicate, condition = Array.prototype.every) {
    if (refVal === undefined)
        return false;
    if (isObject(refRule)) {
        // Complicated rule - like { greater then 10 }
        return condition.call(Object.keys(refRule), (p) => {
            let comparable = refRule[p];
            if (isObject(comparable) || p === "not") {
                if (p === "or") {
                    return check(refVal, comparable, predicate, Array.prototype.some);
                } else {
                    return check(refVal, comparable, predicate[p], condition);
                }
            } else {
                return predicate[p](refVal, comparable);
            }
        });
    }  else {
        // Simple rule - like emptyString
        return predicate[refRule](refVal);
    }
}


describe('Check', function() {
    describe('singleLine', function() {
        it('empty check', function() {
            assert.equal(check("", "empty", predicate), true);
            assert.equal(check(" ", "empty", predicate), false);
        });
        it('NOT empty check', function() {
            assert.equal(check("", { "not": "empty" }, predicate), false);
            assert.equal(check(" ", { "not": "empty" }, predicate), true);
        });
    });
    describe('composite', function() {
        it('greater', function() {
            assert.equal(check(10, { "greater": 5 }, predicate), true);
            assert.equal(check(10, { "greater": 15 }, predicate), false);
        });
        it('NOT greater', function() {
            assert.equal(check(10, { "not" : { "greater": 5 } } , predicate), false);
            assert.equal(check(10, { "not" : { "greater": 15 } }, predicate), true);
        });
    });
    describe('and', function() {
        it("> 5 && < 12", function() {
            assert.equal(check(10, { "greater": 5 }, predicate), true);
            assert.equal(check(10, { "less": 12 }, predicate), true);
            assert.equal(check(10, { "greater": 5, "less": 12 }, predicate), true);
            assert.equal(check(15, { "greater": 5, "less": 12 }, predicate), false);
        });

        it("> 5 && < 12", function() {
            assert.equal(check(10, { "not" : { "greater": 5 } }, predicate), false);
            assert.equal(check(10, { "not" : { "less": 12 } }, predicate), false);
            assert.equal(check(10, { "not" : { "greater": 5, "less": 12 } }, predicate), false);
            assert.equal(check(15, { "not" : { "greater": 5, "less": 12 } }, predicate), false);
        });
    })
    describe('or', function() {
        let rule = { "or": { "less": 5, "greater": 12 } };
        it("< 5 || > 12", function() {
            assert.equal(check(1, rule, predicate), true);
            assert.equal(check(8, rule, predicate), false);
            assert.equal(check(15, rule, predicate), true);
        });


    })

});