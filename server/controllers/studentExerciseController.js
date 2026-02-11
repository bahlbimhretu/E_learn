import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";

export const getExerciseQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    console.log("QuizId from URL:", quizId);

    const quizs = await Quiz.findById(quizId);

    console.log("Quiz found:", quizs);
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ message: "Students only" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz || quiz.status !== "published") {
      return res.status(404).json({ message: "Quiz not available" });
    }

    let questions = await Question.find({ quiz: quizId }).sort({ order: 1 });

    if (quiz.randomizeQuestions) {
      questions = questions.sort(() => Math.random() - 0.5);
    }

    // 🚫 Do NOT send correctAnswers
    const sanitizedQuestions = questions.map((q) => ({
      _id: q._id,
      type: q.type,
      text: q.text,
      options: q.options,
      points: q.points,
    }));

    res.json({
      quiz,
      questions: sanitizedQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const submitExerciseQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ message: "Students only" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz || quiz.status !== "published") {
      return res.status(404).json({ message: "Quiz not available" });
    }

    const questions = await Question.find({ quiz: quizId });

    let totalScore = 0;

    const results = questions.map((question) => {
      const studentAnswer = answers.find(
        (a) => a.questionId === question._id.toString()
      );

      let isCorrect = false;
      let pointsAwarded = 0;

      if (studentAnswer) {
        const correct = JSON.stringify(
          [...question.correctAnswers].sort()
        );

        const selected = JSON.stringify(
          [...studentAnswer.selectedAnswers].sort()
        );

        if (correct === selected) {
          isCorrect = true;
          pointsAwarded = question.points;
          totalScore += question.points;
        }
      }

      return {
        questionId: question._id,
        correctAnswers: question.correctAnswers,
        studentAnswers: studentAnswer?.selectedAnswers || [],
        isCorrect,
        points: question.points,
        pointsAwarded,
      };
    });

    res.json({
      score: totalScore,
      totalPoints: quiz.totalPoints,
      results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// controllers/quizController.js

export const getQuizByLesson = async (req, res) => {
  try {
    
    const { lessonId } = req.params;

    console.log("Looking for lesson:", lessonId);

    const quiz = await Quiz.findOne({ lesson: lessonId });

    console.log("Quiz found:", quiz);

    if (!quiz) {
      return res.status(404).json({ message: "No quiz found" });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

