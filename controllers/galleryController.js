import GalleryItem from "../models/GalleryItem.js";
import { notifyNewGalleryPhoto } from "./adminStatsController.js"; // 🔥 Real-time notification

/* GET all gallery items */
export const getGallery = async (req, res) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
};

/* POST add gallery item */
export const addGalleryItem = async (req, res) => {
  try {
    const item = new GalleryItem({
      title: req.body.title,
      description: req.body.description,
      image: req.file.path, // cloudinary url
    });

    const savedItem = await item.save();
    
    // 🔥 NOTIFY DASHBOARD - Real photo count update + activity log
    notifyNewGalleryPhoto(savedItem.title);
    
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Add gallery error:', error);
    res.status(500).json({ error: "Failed to add gallery item" });
  }
};

/* PUT update gallery item */
export const updateGalleryItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    const updateData = { title, description };

    // if new image uploaded, update image also
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedItem = await GalleryItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Gallery item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Update gallery error:', error);
    res.status(500).json({ error: "Failed to update gallery item" });
  }
};

/* DELETE gallery item */
export const deleteGalleryItem = async (req, res) => {
  try {
    const deletedItem = await GalleryItem.findByIdAndDelete(req.params.id);
    
    if (!deletedItem) {
      return res.status(404).json({ error: "Gallery item not found" });
    }
    
    // 🔥 NOTIFY DASHBOARD - Photo count decreased
    await updateGalleryCountAfterDelete();
    
    res.json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    console.error('Delete gallery error:', error);
    res.status(500).json({ error: "Failed to delete gallery item" });
  }
};

// 🔥 HELPER - Update count after delete
const updateGalleryCountAfterDelete = async () => {
  try {
    const count = await GalleryItem.countDocuments();
    // Update global cache (used by dashboard)
    global.galleryPhotoCount = count;
  } catch (error) {
    console.error('Count update error:', error);
  }
};
