import express from "express";
import {
  getMyCourseInstances,
  getMyCourseInstanceById,

} from "../controllers/teacherCourseInstance.js";
import { protect } from "../middleware/authMiddleware.js";  
import { teacherOnly } from "../middleware/roleMiddleware.js";
import {
  getCourseMarks,
  updateCourseMarks,
} from "../controllers/teacher/teacherMarksController.js";
import { getHomeroomPerformance } from "../controllers/homeroomPerformanceController.js";
const router = express.Router();
router.use(protect, teacherOnly);
router.get("/course-instances", getMyCourseInstances);
router.get("/course-instances/:id", getMyCourseInstanceById);
router.get("/course-instances/:id/marks", getCourseMarks);
router.put("/course-instances/:id/marks", updateCourseMarks);
router.get(
  "/homeroom/performance",
  getHomeroomPerformance
);

export default router;
