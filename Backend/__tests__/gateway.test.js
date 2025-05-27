const request = require("supertest");
const express = require("express");
const gatewayRouter = require("../routes/gatewayRoutes");
const Gateway = require("../models/gatewayModel");

jest.mock("../models/gatewayModel");

const app = express();
app.use(express.json());
app.use("/api/gateway", gatewayRouter);

const mockGateway = {
  _id: "abc123",
  gatewayId: "GW001",
  gatewayName: "Test Gateway",
  lat: 6.9271,
  lng: 79.8612,
  status: "Active",
};

describe("Gateway API", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should fetch all gateways", async () => {
    Gateway.find.mockResolvedValue([mockGateway]);

    const res = await request(app).get("/api/gateway");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].gatewayId).toBe("GW001");
  });

  it("should get gateway by ID", async () => {
    Gateway.findById.mockResolvedValue(mockGateway);

    const res = await request(app).get("/api/gateway/abc123");

    expect(res.statusCode).toBe(200);
    expect(res.body.gatewayName).toBe("Test Gateway");
  });

  it("should return 404 for unknown gateway ID", async () => {
    Gateway.findById.mockResolvedValue(null);

    const res = await request(app).get("/api/gateway/unknown-id");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should not create gateway if fields are missing", async () => {
    const res = await request(app).post("/api/gateway").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/all fields/i);
  });

  it("should update a gateway", async () => {
    Gateway.findById.mockResolvedValue({ ...mockGateway, save: jest.fn().mockResolvedValue(true) });

    const res = await request(app)
      .put("/api/gateway/abc123")
      .send({ gatewayName: "Updated Gateway" });

    expect(res.statusCode).toBe(200);
    expect(res.body.gatewayName).toBe("Updated Gateway");
  });

  it("should return 404 when updating non-existent gateway", async () => {
    Gateway.findById.mockResolvedValue(null);

    const res = await request(app)
      .put("/api/gateway/invalid-id")
      .send({ gatewayName: "Test" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should delete a gateway", async () => {
    Gateway.findByIdAndDelete.mockResolvedValue(mockGateway);

    const res = await request(app).delete("/api/gateway/abc123");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it("should return 404 when deleting non-existent gateway", async () => {
    Gateway.findByIdAndDelete.mockResolvedValue(null);

    const res = await request(app).delete("/api/gateway/invalid-id");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });
});