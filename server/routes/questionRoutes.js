import express from "express";
import {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestions,   // <-- new import
} from "../controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add question to quiz
router.post("/quizzes/:quizId/questions", protect, addQuestion);

// Get all questions for a quiz
router.get("/quizzes/:quizId/questions", protect, getQuestions);

// Update question
router.put("/questions/:id", protect, updateQuestion);

// Delete question
router.delete("/questions/:id", protect, deleteQuestion);

export default router;
