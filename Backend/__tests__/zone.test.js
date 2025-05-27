const request = require("supertest");
const express = require("express");
const zoneRoutes = require("../routes/zoneRoutes");
const Zone = require("../models/Zone");
const cerService = require("../services/cerService");
const zoneUtils = require("../utils/vesselZone");

jest.mock("../models/Zone");
jest.mock("../services/cerService");
jest.mock("../utils/vesselZone");

const app = express();
app.use(express.json());
app.use("/api/zones", zoneRoutes);

describe("Zone Controller", () => {
  const mockZone = {
    _id: "zone1",
    name: "Test Zone",
    zoneType: "normal",
    boundary: [
      { lat: 1.1, lng: 2.2 },
      { lat: 3.3, lng: 4.4 },
    ],
    save: jest.fn(),
  };

  afterEach(() => jest.clearAllMocks());

  it("should create a new zone", async () => {
    Zone.mockImplementation(() => mockZone);
    mockZone.save.mockResolvedValue(mockZone);

    const res = await request(app).post("/api/zones").send({
      name: "Test Zone",
      boundary: mockZone.boundary,
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Test Zone");
  });

  it("should return all zones", async () => {
    Zone.find.mockResolvedValue([mockZone]);

    const res = await request(app).get("/api/zones");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("should return a zone by ID", async () => {
    Zone.findById.mockResolvedValue(mockZone);

    const res = await request(app).get("/api/zones/zone1");

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Test Zone");
  });

  it("should update a zone", async () => {
    Zone.findById.mockResolvedValue(mockZone);
    mockZone.save.mockResolvedValue({ ...mockZone, name: "Updated Zone" });

    const res = await request(app)
      .put("/api/zones/zone1")
      .send({ name: "Updated Zone", boundary: mockZone.boundary });

    expect(res.status).toBe(200);
    expect(res.body.zone.name).toBe("Updated Zone");
  });

  it("should delete a zone", async () => {
    Zone.findByIdAndDelete.mockResolvedValue(mockZone);

    const res = await request(app).delete("/api/zones/zone1");

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/);
  });

  it("should return vessels in a zone", async () => {
    const vessels = [{ vesselId: "v1", lat: 1.1, lng: 2.2 }];
    cerService.getFilteredVesselLocations.mockResolvedValue(vessels);
    Zone.findById.mockResolvedValue(mockZone);
    zoneUtils.isVesselInZone.mockReturnValue(true);

    const res = await request(app).get("/api/zones/vessels/zone1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("should return all vessels if zoneId is 'all'", async () => {
    const vessels = [{ vesselId: "v2", lat: 5.5, lng: 6.6 }];
    cerService.getFilteredVesselLocations.mockResolvedValue(vessels);

    const res = await request(app).get("/api/zones/vessels/all");

    expect(res.status).toBe(200);
    expect(res.body[0].vesselId).toBe("v2");
  });
});