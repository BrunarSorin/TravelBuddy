import express from "express";
import request from "supertest";
import tripRoutes from "../routes/trips.js";

// FULL mock of Trip model
jest.mock("../models/Trip.js", () => ({
  find: jest.fn(() => ({
    sort: jest.fn().mockResolvedValue([]),
  })),
}));

const app = express();
app.use(express.json());
app.use("/api/trips", tripRoutes);

describe("Trip API Unit Tests", () => {
  test("GET /api/trips returns 200 and empty array", async () => {
    const res = await request(app).get("/api/trips");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});
