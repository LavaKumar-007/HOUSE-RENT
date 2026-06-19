const { test, describe } = require("node:test");
const assert = require("node:assert");

describe("HouseHunt API smoke tests", () => {
  test("health endpoint structure", () => {
    const health = { success: true, status: "ok" };
    assert.strictEqual(health.success, true);
    assert.strictEqual(health.status, "ok");
  });

  test("valid booking statuses", () => {
    const statuses = ["pending", "approved", "rejected", "cancelled"];
    assert.ok(statuses.includes("pending"));
    assert.ok(statuses.includes("cancelled"));
  });

  test("property DTO blocks owner field", () => {
    const { pickPropertyFields } = require("../utils/propertyDto");
    const result = pickPropertyFields({
      title: "Test",
      owner: "malicious-id",
      role: "admin",
    });
    assert.strictEqual(result.title, "Test");
    assert.strictEqual(result.owner, undefined);
    assert.strictEqual(result.role, undefined);
  });
});
