// Prueba de ejemplo (CP-01 y CP-02 de tu plan de pruebas).
// Requiere que MONGO_URI apunte a una base de datos de PRUEBA (no la real).
// Corre con: npm test

const request = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();
const app = require("../server");

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API", () => {
  const testUser = {
    name: "Usuario de Prueba",
    email: `test${Date.now()}@ejemplo.com`,
    password: "password123",
  };

  test("CP-01: debe registrar un usuario válido", async () => {
    const res = await request(app).post("/auth/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(testUser.email);
  });

  test("CP-02: debe rechazar login con credenciales inválidas", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: testUser.email, password: "contraseñaIncorrecta" });
    expect(res.statusCode).toBe(401);
  });

  test("debe iniciar sesión con credenciales correctas", async () => {
    const res = await request(app).post("/auth/login").send(testUser);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
