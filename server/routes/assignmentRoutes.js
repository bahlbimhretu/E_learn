import express from "express";
import {
  createAssignment,
  getAssignmentsByLesson,
  deleteAssignment
} from "../controllers/assignmentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
const router = express.Router();

// Create assignment (Teacher only)
router.post(
  "/",
  protect,
  authorize("teacher"),
  upload.single("file"),
  createAssignment
);

// Get assignments by lesson (Teacher + Student)
router.get(
  "/lesson/:lessonId",
  protect,
  authorize("teacher", "student"),
  getAssignmentsByLesson
);

// Delete assignment (Teacher only)
router.delete(
  "/:id",
  protect,
  authorize("teacher"),
  deleteAssignment
);

export default router;
