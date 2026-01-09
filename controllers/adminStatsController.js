import GalleryItem from "../models/GalleryItem.js";
import Event from "../models/Event.js";

let statsCache = {
  galleryPhotos: 0,
  totalStudents: 2456,
  upcomingEvents: 0,
  activityLog: []
};

const getTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins === 1) return "1 min ago";
  if (diffMins < 60) return `${diffMins} mins ago`;
  return `${Math.floor(diffMins / 60)}h ago`;
};

export const notifyNewGalleryPhoto = async () => {
  try {
    const photoCount = await GalleryItem.countDocuments();
    statsCache.galleryPhotos = photoCount;
    
    statsCache.activityLog.unshift({
      id: Date.now(),
      message: "📸 New photo uploaded",
      time: getTimeAgo(new Date()),
      icon: "image"
    });
    statsCache.activityLog = statsCache.activityLog.slice(0, 5);
  } catch (error) {
    console.error('Gallery activity error:', error);
  }
};

export const notifyNewEvent = async () => {
  try {
    const eventCount = await Event.countDocuments();
    statsCache.upcomingEvents = eventCount;
    
    statsCache.activityLog.unshift({
      id: Date.now(),
      message: "📅 New event created",
      time: getTimeAgo(new Date()),
      icon: "calendar"
    });
    statsCache.activityLog = statsCache.activityLog.slice(0, 5);
  } catch (error) {
    console.error('Event activity error:', error);
  }
};

export const getAdminStats = async (req, res) => {
  try {
    statsCache.galleryPhotos = await GalleryItem.countDocuments();
    statsCache.upcomingEvents = await Event.countDocuments();
    
    statsCache.activityLog = statsCache.activityLog.map(log => ({
      ...log,
      time: getTimeAgo(log.id)
    }));
    
    res.json({
      totalPhotos: statsCache.galleryPhotos,
      upcomingEvents: statsCache.upcomingEvents,
      totalStudents: statsCache.totalStudents,
      recentActivity: statsCache.activityLog
    });
  } catch (error) {
    res.status(500).json({ error: 'Stats fetch failed' });
  }
};
