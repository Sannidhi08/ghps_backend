import express from "express";
import { getAdminStats } from "../controllers/adminStatsController.js";

const router = express.Router();

router.get("/stats", getAdminStats);

export default router;
