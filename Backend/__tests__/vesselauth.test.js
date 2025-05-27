const request = require("supertest");
const express = require("express");
const vesselRoutes = require("../routes/vesselAuthRoutes");
const Vessel = require("../models/vesselModel");

jest.mock("../models/vesselModel");

const app = express();
app.use(express.json());
app.use("/api/vessels", vesselRoutes);

describe("Vessel Auth Controller", () => {
  const mockVessel = {
    _id: "v1",
    vesselId: "001",
    vesselName: "Test Vessel",
    email: "vessel@test.com",
    password: "hashedPassword",
    matchPassword: jest.fn(),
    save: jest.fn(),
  };

  afterEach(() => jest.clearAllMocks());

  it("should register a new vessel", async () => {
  // First check - no vessel with that email
  Vessel.findOne
    .mockResolvedValueOnce(null) // email check
    .mockReturnValueOnce({
      sort: () => ({
        exec: jest.fn().mockResolvedValue({ vesselId: "001" }), // mock latest
      }),
    });

  Vessel.create.mockResolvedValue(mockVessel);

  const res = await request(app).post("/api/vessels/vessel-register").send({
    vesselName: "Test Vessel",
    email: "vessel@test.com",
    password: "123456",
  });

  expect(res.status).toBe(201);
  expect(res.body.message).toMatch(/registered successfully/i);
});
  it("should fail to register if vessel exists", async () => {
    Vessel.findOne.mockResolvedValue(mockVessel);

    const res = await request(app).post("/api/vessels/vessel-register").send({
      vesselName: "Test Vessel",
      email: "vessel@test.com",
      password: "123456",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it("should login a vessel with correct credentials", async () => {
    mockVessel.matchPassword.mockResolvedValue(true);
    Vessel.findOne.mockResolvedValue(mockVessel);

    const res = await request(app).post("/api/vessels/vessel-login").send({
      email: "vessel@test.com",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/login successful/i);
    expect(res.body.vesselId).toBe("001");
  });

  it("should fail login with invalid credentials", async () => {
    mockVessel.matchPassword.mockResolvedValue(false);
    Vessel.findOne.mockResolvedValue(mockVessel);

    const res = await request(app).post("/api/vessels/vessel-login").send({
      email: "vessel@test.com",
      password: "wrongpass",
    });

    expect(res.status).toBe(401);
  });

  it("should get all vessels", async () => {
    Vessel.find.mockResolvedValue([{ vesselId: "001", vesselName: "Boat A" }]);

    const res = await request(app).get("/api/vessels");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });

  
  it("should get vessel by vesselId", async () => {
  Vessel.findOne.mockReturnValueOnce({
    select: jest.fn().mockResolvedValue({
      vesselId: "001",
      vesselName: "Mock Vessel",
      email: "vessel@example.com"
    }),
  });

  const res = await request(app).get("/api/vessels/001");

  expect(res.status).toBe(200);
  expect(res.body.vesselId).toBe("001");
});

  it("should change vessel password", async () => {
    Vessel.findOne.mockResolvedValue(mockVessel);
    mockVessel.matchPassword.mockResolvedValue(true);

    const res = await request(app)
      .patch("/api/vessels/001/change-password")
      .send({ oldPassword: "123456", newPassword: "newpass123" });

    expect(res.status).toBe(200);
    expect(mockVessel.save).toHaveBeenCalled();
    expect(res.body.message).toMatch(/password changed/i);
  });

  it("should return 400 if old password is wrong", async () => {
    Vessel.findOne.mockResolvedValue(mockVessel);
    mockVessel.matchPassword.mockResolvedValue(false);

    const res = await request(app)
      .patch("/api/vessels/001/change-password")
      .send({ oldPassword: "wrong", newPassword: "newpass" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/old password is incorrect/i);
  });
});