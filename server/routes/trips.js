import express from "express";
import Notification from "../models/Notification.js";
import Trip from "../models/Trip.js";

const router = express.Router();

// CREATE (Admin)
router.post("/", async (req, res) => {
  try {
    if (req.body.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const trip = await Trip.create(req.body);

    await Notification.create({
      message: `New trip created: ${trip.title}`,
      userId: "all",
    });

    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json(err);
  }
});

// READ (Everyone)
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find().sort({ _id: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE (Admin)
router.put("/:id", async (req, res) => {
  try {
    if (req.body.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const updated = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE (Admin)
router.delete("/:id", async (req, res) => {
  try {
    if (req.body.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: "Trip deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// RSVP (Users)
router.post("/:id/rsvp", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    trip.participants.push({
      userId: req.body.userId,
      status: req.body.status,
    });

    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
