const User = require("../../models/User");

describe("User model", () => {
  test("define username y password requeridos", () => {
    expect(User.schema.path("username").options.required).toBe(true);
    expect(User.schema.path("password").options.required).toBe(true);
  });

  test("username es unico", () => {
    expect(User.schema.path("username").options.unique).toBe(true);
  });
});
