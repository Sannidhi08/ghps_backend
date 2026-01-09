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

// 🔥 VERCEL + LOCAL CORS - PRODUCTION READY
const allowedOrigins = [
  "http://localhost:5173",      // Vite dev
  "http://localhost:3000",      // React dev
  "http://127.0.0.1:5173", 
  "http://127.0.0.1:3000",
  "https://ghps-frontend.vercel.app",  // Your frontend (update after deploy)
  "https://ghps-siddapura-frontend.vercel.app"  // Alternative
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests (Postman, mobile apps)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
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
app.use("/api/admin", adminStatsRoutes);

// 🔥 HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ 
    message: "GHPS Siddapura School Backend ✅",
    version: "1.0.0",
    endpoints: {
      events: "/api/events",
      gallery: "/api/gallery", 
      stats: "/api/admin/stats"
    },
    status: "production-ready"
  });
});

// 🔥 404 HANDLER - BEFORE app.listen()
app.use("*", (req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.originalUrl 
  });
});

// 🔥 VERCEL READY - Perfect port handling
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Test: http://localhost:${PORT}/api/admin/stats`);
  console.log(`✅ CORS enabled for ${allowedOrigins.length} origins`);
});

// For Vercel Serverless export
export default app;
