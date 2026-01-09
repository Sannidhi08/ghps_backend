import Event from "../models/Event.js";
import { notifyNewEvent } from "./adminStatsController.js"; // 🔥 Notification

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

export const createEvent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Event image is required" });
    }

    const { title, description, date } = req.body;
    const event = new Event({
      title,
      description,
      date,
      image: req.file.path,
    });

    const savedEvent = await event.save();
    
    // 🔥 NOTIFY DASHBOARD instantly
    await notifyNewEvent(); // Fixed: No title param needed
    
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create event" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const updatedData = { title, description, date };

    if (req.file) {
      updatedData.image = req.file.path;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update event" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete event" });
  }
};
