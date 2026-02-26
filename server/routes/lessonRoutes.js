import express from "express";
import {
  createLesson,
  getLessonsByCourse,
  getLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/lessonController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create lesson (Teacher/Admin)
router.post(
  "/",
  protect,
  authorize("teacher", "admin"),
  createLesson
);

// Get all lessons for a course
router.get("/course/:courseId", getLessonsByCourse);

// Get single lesson
router.get("/:id", getLesson);

// Update lesson (teacher owner or admin)
router.put(
  "/:id",
  protect,
  authorize("teacher", "admin"),
  updateLesson
);

// Delete lesson (admin only)
router.delete(
  "/:id",
  protect,
  authorize("admin","teacher"),
  deleteLesson
);

export default router;
