import predicate from 'is-predicate';

function check(refVal, refPredRule, predicate) {
    if (refVal === undefined)
        return false;
    if (Array.isArray(refPredRule)) {
        return refPredRule.every(rule => predicate[rule](refVal));
    } else if (typeof refPredRule === 'object') {
        // Complicated rule - like { greater then 10 }
        return Object.
        keys(refPredRule).
        every((pred) => {
            if (pred === 'not') {
                return check(refVal, refPredRule[pred], predicate.not)
            } else {
                let predToUse = predicate[pred];
                let predValue = refPredRule[pred];
                return predToUse(refVal, predValue);
            }
        });
    }  else {
        // Simple rule - like emptyString
        return predicate[refPredRule](refVal);
    }
}

function isRuleApplicable(rule, formData) {
    if (typeof rule !== 'object') {
        console.error(`Rule ${rule} can't be processed`)
        return false;
    }
    return Object.
    keys(rule).
    every((refPred) => {
        let refVal = formData[refPred];
        let refPredRule = rule[refPred];
        return check(refVal, refPredRule, predicate);
    })

};

// const rules = {
//     "password": {
//         "firstName": "emptyString"
//     },
//     "telephone": {
//         "age" : {
//             "greater": "10"
//         }
//     }
// };

export const updateSchema = (rules = {}, formData = {}) => {
    let actions = Object.
        keys(rules).
        map((field) => {
            let applicable = isRuleApplicable(rules[field], formData);
            return { [field]: applicable };
    });

    return Object.assign.apply(this, actions);
};

