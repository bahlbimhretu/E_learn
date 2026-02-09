// routes/studentRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { getStudentCourseInstances, getStudentCourseInstanceById } from "../controllers/student/studentCourseController.js";
import { getStudentLessonsByCourse } from "../controllers/student/studentLessonController.js";
const router = express.Router();

router.get(
  "/course-instances",
  protect,
  authorize("student"),
  getStudentCourseInstances
);
// Single Course
router.get(
  "/course-instances/:id",
  protect,
  authorize("student"),
  getStudentCourseInstanceById
);

// Lessons
router.get(
  "/course-instances/:id/lessons",
  protect,
  authorize("student"),
  getStudentLessonsByCourse
);
export default router;
