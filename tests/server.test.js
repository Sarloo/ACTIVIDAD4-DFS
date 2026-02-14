describe("server", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.VERCEL = "1";
    process.env.MONGO_URI = "mongodb://fake-host/testdb";
  });

  test("exporta app y llama mongoose.connect con MONGO_URI", () => {
    jest.doMock("mongoose", () => {
      const actual = jest.requireActual("mongoose");
      return {
        ...actual,
        connect: jest.fn().mockResolvedValue(undefined)
      };
    });

    let app;
    let mockedMongoose;

    jest.isolateModules(() => {
      app = require("../server");
      mockedMongoose = require("mongoose");
    });

    expect(app).toBeDefined();
    expect(typeof app.use).toBe("function");
    expect(mockedMongoose.connect).toHaveBeenCalledWith("mongodb://fake-host/testdb");
  });
});
