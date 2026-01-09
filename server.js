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

// 🔥 CURRENT DOMAIN ONLY
app.use(cors({
  origin: "https://ghps-siddaura.vercel.app/",  // ← YOUR CURRENT DOMAIN
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
    corsOrigin: "https://ghps-siddaura.vercel.app/",
    status: "active"
  });
});

// 🔥 404
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// 🔥 PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend: port ${PORT}`);
});

export default app;
