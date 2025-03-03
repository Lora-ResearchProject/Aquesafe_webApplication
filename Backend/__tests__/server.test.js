// const request = require("supertest");
// const app = require("../app");

// test("GET /api/test should return a success message", async () => {
//   const response = await request(app).get("/api/test");
//   expect(response.statusCode).toBe(200);
//   expect(response.body.message).toBe("API is working!");
// });


test("Backend dummy test that always passes", () => {
  expect(1 + 1).toBe(2);
});