jest.mock("../../models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

jest.mock("../../models/AccessLog", () => ({
  create: jest.fn(),
  find: jest.fn()
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn()
}));

const User = require("../../models/User");
const AccessLog = require("../../models/AccessLog");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authController = require("../../controllers/authController");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("authController.register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("retorna 400 si faltan campos", async () => {
    const req = { body: { username: "", password: "" } };
    const res = mockRes();

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Usuario y contraseña son obligatorios" });
  });

  test("retorna 400 si usuario existe", async () => {
    User.findOne.mockResolvedValue({ _id: "u1" });
    const req = { body: { username: "carlos", password: "123456" } };
    const res = mockRes();

    await authController.register(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ username: "carlos" });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "El usuario ya existe" });
  });

  test("registra usuario con password encriptada", async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed");
    User.create.mockResolvedValue({ _id: "u1" });
    const req = { body: { username: "carlos", password: "123456" } };
    const res = mockRes();

    await authController.register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
    expect(User.create).toHaveBeenCalledWith({ username: "carlos", password: "hashed" });
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Usuario registrado correctamente" });
  });

  test("retorna 500 ante error inesperado", async () => {
    User.findOne.mockRejectedValue(new Error("db fail"));
    const req = { body: { username: "carlos", password: "123456" } };
    const res = mockRes();

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Error al registrar usuario" });
  });
});

describe("authController.login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test_secret";
  });

  test("retorna 400 si faltan campos", async () => {
    const req = { body: { username: "", password: "" } };
    const res = mockRes();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Usuario y contraseña son obligatorios" });
  });

  test("retorna 401 si usuario no existe", async () => {
    User.findOne.mockResolvedValue(null);
    const req = { body: { username: "nadie", password: "123456" } };
    const res = mockRes();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Usuario no existe" });
  });

  test("retorna 401 si contraseña es incorrecta", async () => {
    User.findOne.mockResolvedValue({ _id: "u1", username: "carlos", password: "hash" });
    bcrypt.compare.mockResolvedValue(false);
    const req = { body: { username: "carlos", password: "mala" } };
    const res = mockRes();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Contraseña incorrecta" });
  });

  test("retorna 500 si falta JWT_SECRET", async () => {
    delete process.env.JWT_SECRET;
    User.findOne.mockResolvedValue({ _id: "u1", username: "carlos", password: "hash" });
    bcrypt.compare.mockResolvedValue(true);
    const req = { body: { username: "carlos", password: "123456" } };
    const res = mockRes();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Falta configurar JWT_SECRET en .env" });
  });

  test("retorna token y guarda access log en login exitoso", async () => {
    User.findOne.mockResolvedValue({ _id: "u1", username: "carlos", password: "hash" });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("token_ok");
    AccessLog.create.mockResolvedValue({ _id: "a1" });
    const req = { body: { username: "carlos", password: "123456" } };
    const res = mockRes();

    await authController.login(req, res);

    expect(jwt.sign).toHaveBeenCalledWith({ id: "u1" }, "test_secret");
    expect(AccessLog.create).toHaveBeenCalledWith({ username: "carlos" });
    expect(res.json).toHaveBeenCalledWith({ token: "token_ok" });
  });
});

describe("authController.getRecentAccesses", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("retorna ultimos accesos", async () => {
    const expected = [{ username: "carlos", loginAt: new Date() }];
    const select = jest.fn().mockResolvedValue(expected);
    const limit = jest.fn().mockReturnValue({ select });
    const sort = jest.fn().mockReturnValue({ limit });
    AccessLog.find.mockReturnValue({ sort });
    const req = {};
    const res = mockRes();

    await authController.getRecentAccesses(req, res);

    expect(sort).toHaveBeenCalledWith({ loginAt: -1 });
    expect(limit).toHaveBeenCalledWith(8);
    expect(select).toHaveBeenCalledWith("username loginAt -_id");
    expect(res.json).toHaveBeenCalledWith(expected);
  });

  test("retorna 500 si falla consulta", async () => {
    AccessLog.find.mockImplementation(() => {
      throw new Error("fail");
    });
    const req = {};
    const res = mockRes();

    await authController.getRecentAccesses(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "No se pudieron obtener los accesos" });
  });
});
