import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const notes = await Notification.find({ userId: req.params.userId }).sort({
    createdAt: -1,
  });

  res.json(notes);
});

export default router;
