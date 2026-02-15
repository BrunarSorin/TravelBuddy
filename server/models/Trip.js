import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  title: String,
  date: String,
  location: String,
  createdBy: String,
  participants: [{ userId: String, status: String }],
});

export default mongoose.model("Trip", TripSchema);
