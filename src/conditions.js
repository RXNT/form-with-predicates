import predicate from "is-predicate";

const POSITIVE_PREDICATE = predicate;
const NEGATIVE_PREDICATE = predicate.not;

export function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

export function check(
  refVal,
  refRule,
  predicator = predicate,
  condition = Array.prototype.every
) {
  if (refVal === undefined) {
    return true;
  }
  if (isObject(refRule)) {
    // Complicated rule - like { greater then 10 }
    return condition.call(Object.keys(refRule), p => {
      let comparable = refRule[p];
      if (isObject(comparable) || p === "not") {
        if (p === "or") {
          if (Array.isArray(comparable)) {
            return comparable.some(condition =>
              check(refVal, condition, predicator, Array.prototype.every)
            );
          } else {
            return check(refVal, comparable, predicator, Array.prototype.some);
          }
        } else if (p === "not") {
          let oppositePredicator = predicator === NEGATIVE_PREDICATE
            ? POSITIVE_PREDICATE
            : NEGATIVE_PREDICATE;
          return check(
            refVal,
            comparable,
            oppositePredicator,
            Array.prototype.every
          );
        } else {
          return check(
            refVal,
            comparable,
            predicator[p],
            Array.prototype.every
          );
        }
      } else {
        return predicator[p](refVal, comparable);
      }
    });
  } else {
    // Simple rule - like emptyString
    return predicator[refRule](refVal);
  }
}

export function isRuleApplicable(rule, formData) {
  if (!isObject(rule) || !isObject(formData)) {
    let message = `Rule ${rule} with ${formData} can't be processed`;
    if (process.env.NODE_ENV !== "production") {
      throw new ReferenceError(message);
    } else {
      console.error(message);
    }
    return false;
  }
  return Object.keys(rule).every(refPred => {
    let refVal = formData[refPred];
    let refPredRule = rule[refPred];
    return check(refVal, refPredRule);
  });
}

export const actionToFields = (rules = {}, formData = {}) => {
  let actions = Object.keys(rules).map(field => {
    let applicable = isRuleApplicable(rules[field], formData);
    return { [field]: applicable };
  });

  return Object.assign.apply(this, actions);
};
