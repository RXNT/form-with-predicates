const assert = require("assert");
const { isRuleApplicable } = require("../../src/conditions");

describe("isRuleApplicable", function() {
  describe("sanity check", function() {
    it("requires rule to be an object", function() {
      assert.throws(function() {
        isRuleApplicable("empty", {});
      }, ReferenceError);
    });
    it("requires formData to be an object", function() {
      assert.throws(function() {
        isRuleApplicable({}, 0);
      }, ReferenceError);
    });
  });
  describe("single line", function() {
    let singleLine = {
      firstName: "empty",
    };
    it("empty check", function() {
      assert.equal(isRuleApplicable(singleLine, {}), true);
      assert.equal(isRuleApplicable(singleLine, { firstName: "some" }), false);
      assert.equal(isRuleApplicable(singleLine, { firstName: "" }), true);
      assert.equal(
        isRuleApplicable(singleLine, { firstName: undefined }),
        true
      );
    });
  });
});
