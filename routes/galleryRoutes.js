import express from "express";
import upload from "../middleware/upload.js";
import {
  getGallery,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../controllers/galleryController.js";

const router = express.Router();

router.get("/", getGallery);
router.post("/", upload.single("image"), addGalleryItem);
router.put("/:id", upload.single("image"), updateGalleryItem);
router.delete("/:id", deleteGalleryItem);

export default router;
