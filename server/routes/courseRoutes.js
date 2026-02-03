import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

import {
  getMyCourseInstances,
  getMyCourseInstance
} from "../controllers/courseController.js"; // new teacher controller

const router = express.Router();

// =====================
// TEACHER COURSE INSTANCE ROUTES
// =====================

// Get all course instances assigned to the logged-in teacher
router.get(
  "/teacher/course-instances",
  protect,
  authorize("teacher"),
  getMyCourseInstances
);

// Get a single course instance assigned to the logged-in teacher
router.get(
  "/teacher/course-instances/:id",
  protect,
  authorize("teacher"),
  getMyCourseInstance
);

export default router;
