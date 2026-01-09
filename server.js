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

// 🔥 PERFECT CORS - Vite + React support
const allowedOrigins = [
  "http://localhost:5173",  // Vite default
  "http://localhost:3000",  // Create React App
  "http://localhost:3001",  // Other common ports
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 🔥 ROUTES - PERFECT STRUCTURE
app.use("/api/events", eventRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/admin", adminStatsRoutes);  // Single /api/admin/stats endpoint

// 🔥 HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ 
    message: "GHPS Siddapura School Backend ✅",
    endpoints: {
      events: "/api/events",
      gallery: "/api/gallery", 
      stats: "/api/admin/stats"
    },
    corsAllowed: allowedOrigins 
  });
});

// 🔥 404 HANDLER
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Test: http://localhost:${PORT}/api/admin/stats`);
  console.log(`✅ CORS enabled for: ${allowedOrigins.join(", ")}`);
});
