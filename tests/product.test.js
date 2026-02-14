const Product = require("../models/Product");

describe("Product model", () => {
  test("define nombre y precio requeridos", () => {
    expect(Product.schema.path("nombre").options.required).toBe(true);
    expect(Product.schema.path("precio").options.required).toBe(true);
  });

  test("define stock con default y minimo", () => {
    expect(Product.schema.path("stock").options.default).toBe(0);
    expect(Product.schema.path("stock").options.min).toBe(0);
    expect(Product.schema.path("stock").options.required).toBe(true);
  });

  test("usa timestamps", () => {
    expect(Product.schema.options.timestamps).toBe(true);
  });

  test("creadoPor referencia User y es requerido", () => {
    expect(Product.schema.path("creadoPor").options.required).toBe(true);
    expect(Product.schema.path("creadoPor").options.ref).toBe("User");
  });
});
