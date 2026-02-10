import express from "express";
import {
  createQuiz,
  updateQuiz,
  togglePublishQuiz,
} from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create quiz for a lesson
router.post("/lessons/:lessonId/quiz", protect, createQuiz);

// Update quiz settings
router.put("/quizzes/:quizId", protect, updateQuiz);

// Publish / unpublish quiz
router.patch("/quizzes/:quizId/publish", protect, togglePublishQuiz);

export default router;
