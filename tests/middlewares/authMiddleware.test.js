jest.mock("jsonwebtoken", () => ({
  verify: jest.fn()
}));

const jwt = require("jsonwebtoken");
const authMiddleware = require("../../middlewares/authMiddleware");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("authMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("retorna 401 si no hay token", () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Acceso denegado" });
    expect(next).not.toHaveBeenCalled();
  });

  test("continua si token es valido", () => {
    const req = { headers: { authorization: "token_ok" } };
    const res = mockRes();
    const next = jest.fn();
    jwt.verify.mockReturnValue({ id: "u1" });
    process.env.JWT_SECRET = "test_secret";

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("token_ok", "test_secret");
    expect(req.user).toEqual({ id: "u1" });
    expect(next).toHaveBeenCalled();
  });

  test("retorna 401 si token es invalido", () => {
    const req = { headers: { authorization: "token_bad" } };
    const res = mockRes();
    const next = jest.fn();
    jwt.verify.mockImplementation(() => {
      throw new Error("bad token");
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Token inválido" });
    expect(next).not.toHaveBeenCalled();
  });
});
