jest.mock("../../models/Product", () => ({
  find: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
}));

const Product = require("../../models/Product");
const productController = require("../../controllers/productController");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("productController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getProducts retorna productos con populate", async () => {
    const products = [{ nombre: "Laptop" }];
    const populate = jest.fn().mockResolvedValue(products);
    Product.find.mockReturnValue({ populate });
    const req = {};
    const res = mockRes();

    await productController.getProducts(req, res);

    expect(Product.find).toHaveBeenCalled();
    expect(populate).toHaveBeenCalledWith("creadoPor", "username");
    expect(res.json).toHaveBeenCalledWith(products);
  });

  test("createProduct crea producto con usuario autenticado", async () => {
    const created = { _id: "p1", nombre: "Laptop" };
    Product.create.mockResolvedValue(created);
    const req = {
      body: { nombre: "Laptop", precio: 1000, stock: 5 },
      user: { id: "u1" }
    };
    const res = mockRes();

    await productController.createProduct(req, res);

    expect(Product.create).toHaveBeenCalledWith({
      nombre: "Laptop",
      precio: 1000,
      stock: 5,
      creadoPor: "u1"
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  test("updateProduct actualiza y retorna documento", async () => {
    const updated = { _id: "p1", nombre: "Monitor" };
    Product.findByIdAndUpdate.mockResolvedValue(updated);
    const req = { params: { id: "p1" }, body: { nombre: "Monitor" } };
    const res = mockRes();

    await productController.updateProduct(req, res);

    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith("p1", { nombre: "Monitor" }, { new: true });
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  test("deleteProduct elimina y responde mensaje", async () => {
    Product.findByIdAndDelete.mockResolvedValue({ _id: "p1" });
    const req = { params: { id: "p1" } };
    const res = mockRes();

    await productController.deleteProduct(req, res);

    expect(Product.findByIdAndDelete).toHaveBeenCalledWith("p1");
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Producto eliminado" });
  });
});
