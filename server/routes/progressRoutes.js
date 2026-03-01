import express from "express";
import {
  markLessonCompleted,
  getCourseProgress,
} from "../controllers/progressController.js";
import { protect} from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorize("student"));

router.post("/complete", markLessonCompleted);
router.get("/:courseId", getCourseProgress);

export default router;