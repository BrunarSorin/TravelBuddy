import express from "express";
import Trip from "../models/Trip.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const trip = await Trip.create(req.body);
  res.json(trip);
});

router.get("/", async (req, res) => {
  const trips = await Trip.find();
  res.json(trips);
});

router.post("/:id/rsvp", async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  trip.participants.push(req.body);
  await trip.save();
  res.json(trip);
});

export default router;
