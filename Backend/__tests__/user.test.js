const request = require("supertest");
const express = require("express");
const userRouter = require("../routes/userRoutes");
const User = require("../models/userModel");
const emailService = require("../services/emailService");
const templates = require("../utils/emailTemplates");
const jwt = require("jsonwebtoken");
const { protect, authorize } = require("../middleware/authMiddleware");

process.env.JWT_SECRET = "testsecret"; // Required for token generation

jest.mock("../models/userModel");
jest.mock("../services/emailService");
jest.mock("../utils/emailTemplates");
jest.mock("../middleware/authMiddleware", () => ({
  protect: (req, res, next) => {
    req.user = { id: "1", role: "admin" }; // Simulate authenticated admin
    next();
  },
  authorize: () => (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/api/users", userRouter);

const mockUser = {
  _id: "1",
  name: "John",
  email: "john@example.com",
  password: "hashedpass",
  role: "admin",
  save: jest.fn(),
  matchPassword: jest.fn(async function (pw) {
    return pw === "123456"; // Simulate valid password match
  }),
};

describe("User Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("creates a user as admin", async () => {
    User.findById.mockResolvedValue({ ...mockUser });
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ ...mockUser });
    templates.newUserAccountEmail.mockReturnValue("<p>HTML</p>");
    emailService.sendEmail.mockResolvedValue();

    const res = await request(app)
      .post("/api/users")
      .send({ name: "Jane", email: "jane@example.com" });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/User created successfully/);
  });

  it("logs in a user with correct credentials", async () => {
    User.findOne.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/users/login")
      .send({ email: mockUser.email, password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(mockUser.email);
    expect(res.body.token).toBeDefined();
  });

  it("gets user profile", async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockReturnValue(Promise.resolve(mockUser)),
    });

    const res = await request(app).get("/api/users/profile");

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(mockUser.name);
  });

  it("returns error if passwords do not match during change", async () => {
    User.findById.mockResolvedValue({
      ...mockUser,
      matchPassword: () => false,
    });

    const res = await request(app)
      .post("/api/users/change-password")
      .send({ currentPassword: "wrong", newPassword: "newpass" });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Current password is incorrect/);
  });

  it("updates user profile", async () => {
    User.findById.mockResolvedValue(mockUser);
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .put("/api/users/profile")
      .send({ name: "Johnny" });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/User Updated successfully/);
  });

  it("sends reset password email", async () => {
    User.findOne.mockResolvedValue({ ...mockUser, save: jest.fn() });
    templates.resetPasswordEmail.mockReturnValue("<p>Reset</p>");
    emailService.sendEmail.mockResolvedValue();

    const res = await request(app)
      .post("/api/users/forgot-password")
      .send({ email: mockUser.email });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Password reset email sent/);
  });
});
