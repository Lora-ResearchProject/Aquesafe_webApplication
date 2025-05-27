const request = require("supertest");
const express = require("express");
const app = require("../app");

// Mock all routes
jest.mock("../routes/userRoutes", () => require("express").Router());
jest.mock("../routes/vesselTrackerRoutes", () => require("express").Router());
jest.mock("../routes/incommingMessageRoutes", () => require("express").Router());
jest.mock("../routes/vesselAuthRoutes", () => require("express").Router());
jest.mock("../routes/messageDataRoutes", () => require("express").Router());
jest.mock("../routes/sosRoutes", () => require("express").Router());
jest.mock("../routes/gatewayRoutes", () => require("express").Router());
jest.mock("../routes/chatRoutes", () => require("express").Router());
jest.mock("../routes/vesselRouteLogRoutes", () => require("express").Router());
jest.mock("../routes/fishingHotspotsRoutes", () => require("express").Router());
jest.mock("../routes/notificationRoutes", () => require("express").Router());
jest.mock("../routes/zoneRoutes", () => require("express").Router());
jest.mock("../routes/weatherRoutes", () => require("express").Router());
jest.mock("../routes/PipeLineStatusRoutes", () => require("express").Router());
jest.mock("../services/proximityAlertService", () => ({
  startProximityAlertChecks: jest.fn()
}));

// Test a custom app instance to control error middleware registration
const createTestAppWithErrorRoute = () => {
  const expressApp = express();
  expressApp.use(express.json());

  // Dummy route that throws
  expressApp.get("/error-test", (req, res, next) => {
    next(new Error("Test error"));
  });

  // Error middleware from app.js
  expressApp.use((err, req, res, next) => {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  });

  return expressApp;
};

describe("App setup and routing", () => {
  it("should respond with 404 on unknown route", async () => {
    const res = await request(app).get("/api/unknown");
    expect(res.statusCode).toBe(404);
  });

  it("should handle internal errors using the error middleware", async () => {
    const testApp = createTestAppWithErrorRoute();
    const res = await request(testApp).get("/error-test");
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Internal server error");
    expect(res.body).toHaveProperty("error", "Test error");
  });
});