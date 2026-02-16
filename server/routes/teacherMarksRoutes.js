import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  getCourseMarks,
  updateCourseMarks,
} from "../controllers/teacherMarksController.js";

const router = express.Router();

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
