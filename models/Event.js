import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    date: String,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
