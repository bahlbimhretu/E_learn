import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  startQuizAttempt,
  submitQuizAttempt,
} from "../controllers/studentQuizAttemptController.js";

const router = express.Router();

router.post("/quizzes/:quizId/attempts/start", protect, startQuizAttempt);
router.post("/attempts/:attemptId/submit", protect, submitQuizAttempt);

export default router;
