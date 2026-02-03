import express from "express";
import {
  enrollStudent,
  getCourseEnrollments,
  getStudentEnrollments,
} from "../controllers/enrollmentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// STUDENT enroll
router.post("/", protect, authorize("student"), enrollStudent);

// STUDENT view own enrolled courses
router.get("/me", protect, authorize("student"), getStudentEnrollments);

// TEACHER/ADMIN view students enrolled in a course
router.get(
  "/course/:courseId",
  protect,
  authorize("teacher", "admin"),
  getCourseEnrollments
);

export default router;
