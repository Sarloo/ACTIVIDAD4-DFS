jest.mock("../../middlewares/authMiddleware", () => jest.fn());

jest.mock("../../controllers/productController", () => ({
  getProducts: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn()
}));

const authMiddleware = require("../../middlewares/authMiddleware");
const productController = require("../../controllers/productController");
const productRoutes = require("../../routes/productRoutes");

function getRoute(path, method) {
  const layer = productRoutes.stack.find(
    (item) => item.route && item.route.path === path && item.route.methods[method]
  );
  return layer ? layer.route : null;
}

describe("productRoutes", () => {
  test("define GET / con auth y getProducts", () => {
    const route = getRoute("/", "get");

    expect(route).toBeTruthy();
    expect(route.methods.get).toBe(true);
    expect(route.stack[0].handle).toBe(authMiddleware);
    expect(route.stack[1].handle).toBe(productController.getProducts);
  });

  test("define POST / con auth y createProduct", () => {
    const route = getRoute("/", "post");

    expect(route).toBeTruthy();
    expect(route.methods.post).toBe(true);
    expect(route.stack[0].handle).toBe(authMiddleware);
    expect(route.stack[1].handle).toBe(productController.createProduct);
  });

  test("define PUT /:id con auth y updateProduct", () => {
    const route = getRoute("/:id", "put");

    expect(route).toBeTruthy();
    expect(route.methods.put).toBe(true);
    expect(route.stack[0].handle).toBe(authMiddleware);
    expect(route.stack[1].handle).toBe(productController.updateProduct);
  });

  test("define DELETE /:id con auth y deleteProduct", () => {
    const route = getRoute("/:id", "delete");

    expect(route).toBeTruthy();
    expect(route.methods.delete).toBe(true);
    expect(route.stack[0].handle).toBe(authMiddleware);
    expect(route.stack[1].handle).toBe(productController.deleteProduct);
  });
});
