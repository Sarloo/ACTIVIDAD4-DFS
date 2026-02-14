jest.mock("../../controllers/authController", () => ({
  register: jest.fn(),
  login: jest.fn(),
  getRecentAccesses: jest.fn()
}));

const authController = require("../../controllers/authController");
const authRoutes = require("../../routes/authRoutes");

function getRoute(path) {
  const layer = authRoutes.stack.find((item) => item.route && item.route.path === path);
  return layer ? layer.route : null;
}

describe("authRoutes", () => {
  test("define POST /register con controlador register", () => {
    const route = getRoute("/register");

    expect(route).toBeTruthy();
    expect(route.methods.post).toBe(true);
    expect(route.stack[0].handle).toBe(authController.register);
  });

  test("define POST /login con controlador login", () => {
    const route = getRoute("/login");

    expect(route).toBeTruthy();
    expect(route.methods.post).toBe(true);
    expect(route.stack[0].handle).toBe(authController.login);
  });

  test("define GET /access-logs con controlador getRecentAccesses", () => {
    const route = getRoute("/access-logs");

    expect(route).toBeTruthy();
    expect(route.methods.get).toBe(true);
    expect(route.stack[0].handle).toBe(authController.getRecentAccesses);
  });
});
