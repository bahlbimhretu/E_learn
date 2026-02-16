import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

import {
  getMyCourseInstances,
  getMyCourseInstance
} from "../controllers/courseController.js"; // new teacher controller
import {
  getCourseMarks,
  updateCourseMarks
} from "../controllers/teacherMarksController.js";

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

// =====================
// TEACHER MARKS ROUTES
// =====================

router.get(
  "/teacher/course-instances/:id/marks",
  protect,
  authorize("teacher"),
  getCourseMarks
);

router.put(
  "/teacher/course-instances/:id/marks",
  protect,
  authorize("teacher"),
  updateCourseMarks
);

export default router;
