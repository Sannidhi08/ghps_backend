import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import eventRoutes from "./routes/eventRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import adminStatsRoutes from "./routes/adminStatsRoutes.js";

dotenv.config();
connectDB();

const app = express();

// 🔥 BULLETPROOF CORS - WORKS EVERY CASE
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      "https://ghps-siddaura.vercel.app",
      "https://ghps-siddaura.vercel.app/", 
      "https://ghps-frontend-kohl.vercel.app",
      "http://localhost:5173"
    ];
    
    if (!origin || allowed.some(url => origin === url)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
}));

// 🔥 BODY PARSERS
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🔥 ROUTES
app.use("/api/events", eventRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/admin", adminStatsRoutes);

// 🔥 HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ 
    message: "GHPS Siddapura Backend ✅",
    corsOrigins: 4,
    status: "active",
    endpoints: {
      events: "/api/events",
      gallery: "/api/gallery", 
      admin: "/api/admin"
    }
  });
});

// 🔥 404 HANDLER
app.use("*", (req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.originalUrl 
  });
});

// 🔥 VERCEL + LOCAL PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 GHPS Backend: port ${PORT}`);
});

export default app;
