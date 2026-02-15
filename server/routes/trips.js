import express from "express";
import Notification from "../models/Notification.js";
import Trip from "../models/Trip.js";

const router = express.Router();

// Create Trip
router.post("/", async (req, res) => {
  try {
    const { title, date, location, createdBy } = req.body;

    const trip = await Trip.create({
      title,
      date,
      location,
      createdBy,
      participants: [],
    });

    // Create notification
    await Notification.create({
      message: `New trip created: ${title}`,
      userId: createdBy,
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Error creating trip", error });
  }
});

// Get All Trips
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find().sort({ _id: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trips", error });
  }
});

// RSVP to Trip
router.post("/:id/rsvp", async (req, res) => {
  try {
    const { userId, status } = req.body;

    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    trip.participants.push({ userId, status });
    await trip.save();

    // Create notification
    await Notification.create({
      message: `New RSVP (${status}) for trip: ${trip.title}`,
      userId: trip.createdBy,
    });

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Error updating RSVP", error });
  }
});

export default router;
