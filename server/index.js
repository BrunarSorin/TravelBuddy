import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import notificationRoutes from "./routes/notifications.js";
import tripRoutes from "./routes/trips.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/notifications", notificationRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB error:", err));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
