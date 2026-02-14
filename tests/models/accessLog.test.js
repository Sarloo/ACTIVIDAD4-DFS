const AccessLog = require("../../models/AccessLog");

describe("AccessLog model", () => {
  test("define username requerido", () => {
    expect(AccessLog.schema.path("username").options.required).toBe(true);
  });

  test("define loginAt con default Date.now", () => {
    expect(typeof AccessLog.schema.path("loginAt").options.default).toBe("function");
  });
});
