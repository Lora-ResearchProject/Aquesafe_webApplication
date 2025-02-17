const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const User = require("../models/userModel");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

test("POST /api/users/register should create a user", async () => {
  const response = await request(app).post("/api/users/register").send({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  });

  expect(response.statusCode).toBe(201);
  expect(response.body.name).toBe("Test User");
  expect(response.body.email).toBe("test@example.com");
  

  const user = await User.findOne({ email: "test@example.com" });
  expect(user).not.toBeNull();
});