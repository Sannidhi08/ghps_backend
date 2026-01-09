import mongoose from "mongoose";

const galleryItemSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("GalleryItem", galleryItemSchema);
