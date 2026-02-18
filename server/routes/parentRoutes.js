import express from "express";
import {
  getMyChildren,
  getChildOverview,
  getChildPerformance,
} from "../controllers/parentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/children", protect, getMyChildren);
router.get("/:childId/overview", protect, getChildOverview);
router.get("/:childId/performance", protect, getChildPerformance);

export default router;
