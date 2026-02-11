import express from "express";
import {
  getExerciseQuiz,
  submitExerciseQuiz,
  getQuizByLesson,
} from "../controllers/studentExerciseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/quizzes/:quizId/exercise", protect, getExerciseQuiz);
router.post("/quizzes/:quizId/exercise/submit", protect, submitExerciseQuiz);
// routes/quizRoutes.js

router.get("/lessons/:lessonId/quiz", protect, getQuizByLesson);

export default router;
