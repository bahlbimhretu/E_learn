import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import QuizAttempt from "../models/QuizAttempt.js";

const shuffleIds = (ids) => {
  const arr = [...ids];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const sanitizeQuestions = (questions) =>
  questions.map((q) => ({
    _id: q._id,
    type: q.type,
    text: q.text,
    options: q.options,
    points: q.points,
  }));

const buildOrderedQuestions = (questions, orderIds) => {
  const map = new Map();
  questions.forEach((q) => map.set(q._id.toString(), q));
  return orderIds
    .map((id) => map.get(id.toString()))
    .filter(Boolean);
};

const countCompletedAttempts = async (quizId, studentId) => {
  return QuizAttempt.countDocuments({
    quiz: quizId,
    student: studentId,
    status: { $in: ["submitted", "expired"] },
  });
};

/**
 * START OR RESUME QUIZ ATTEMPT
 * POST /api/student/quizzes/:quizId/attempts/start
 */
export const startQuizAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ message: "Students only" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz || quiz.status !== "published") {
      return res.status(404).json({ message: "Quiz not available" });
    }

    // Resume in-progress attempt if it exists and not expired
    const existingAttempt = await QuizAttempt.findOne({
      quiz: quizId,
      student: req.user._id,
      status: "in_progress",
    });

    if (existingAttempt) {
      const now = new Date();
      if (existingAttempt.expiresAt && now > existingAttempt.expiresAt) {
        existingAttempt.status = "expired";
        existingAttempt.submittedAt = now;
        await existingAttempt.save();
      } else {
        const questions = await Question.find({
          _id: { $in: existingAttempt.questionOrder },
        });
        const ordered = buildOrderedQuestions(
          questions,
          existingAttempt.questionOrder
        );
        const completed = await countCompletedAttempts(
          quizId,
          req.user._id
        );

        return res.json({
          quiz,
          attempt: existingAttempt,
          questions: sanitizeQuestions(ordered),
          answers: existingAttempt.answers || [],
          attemptsRemaining: Math.max(
            (quiz.attemptsAllowed || 1) - completed,
            0
          ),
        });
      }
    }

    // Check attempts limit
    const completedAttempts = await countCompletedAttempts(
      quizId,
      req.user._id
    );
    const attemptsAllowed = quiz.attemptsAllowed || 1;
    if (completedAttempts >= attemptsAllowed) {
      return res.status(400).json({ message: "Attempt limit reached" });
    }

    const totalAttempts = await QuizAttempt.countDocuments({
      quiz: quizId,
      student: req.user._id,
    });

    let questions = await Question.find({ quiz: quizId }).sort({ order: 1 });
    if (!questions.length) {
      return res.status(400).json({ message: "Quiz has no questions" });
    }

    let questionOrder = questions.map((q) => q._id);
    if (quiz.randomizeQuestions) {
      questionOrder = shuffleIds(questionOrder);
      questions = buildOrderedQuestions(questions, questionOrder);
    }

    const attempt = await QuizAttempt.create({
      quiz: quiz._id,
      student: req.user._id,
      lesson: quiz.lesson,
      course: quiz.course,
      attemptNumber: totalAttempts + 1,
      timeLimitMinutes: quiz.timeLimit ?? null,
      passScore: quiz.passScore ?? null,
      questionOrder,
    });

    return res.status(201).json({
      quiz,
      attempt,
      questions: sanitizeQuestions(questions),
      answers: attempt.answers || [],
      attemptsRemaining: Math.max(attemptsAllowed - completedAttempts - 1, 0),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * SUBMIT QUIZ ATTEMPT
 * POST /api/student/attempts/:attemptId/submit
 */
export const submitQuizAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;

    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ message: "Students only" });
    }

    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    if (attempt.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (attempt.status !== "in_progress") {
      return res.status(400).json({ message: "Attempt already closed" });
    }

    const quiz = await Quiz.findById(attempt.quiz);
    if (!quiz || quiz.status !== "published") {
      return res.status(404).json({ message: "Quiz not available" });
    }

    const now = new Date();
    const isExpired = attempt.expiresAt && now > attempt.expiresAt;

    const questions = await Question.find({ quiz: attempt.quiz });
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    let totalScore = 0;

    const results = questions.map((question) => {
      const studentAnswer = (answers || []).find(
        (a) => a.questionId === question._id.toString()
      );

      const selectedAnswers = Array.isArray(
        studentAnswer?.selectedAnswers
      )
        ? studentAnswer.selectedAnswers.map((n) => Number(n))
        : [];

      const correctAnswers = [...question.correctAnswers].map((n) =>
        Number(n)
      );

      const isCorrect =
        selectedAnswers.length > 0 &&
        JSON.stringify([...correctAnswers].sort()) ===
          JSON.stringify([...selectedAnswers].sort());

      const pointsAwarded = isCorrect ? question.points : 0;
      totalScore += pointsAwarded;

      return {
        questionId: question._id,
        correctAnswers,
        studentAnswers: selectedAnswers,
        isCorrect,
        points: question.points,
        pointsAwarded,
      };
    });

    attempt.answers = answers || [];
    attempt.results = results;
    attempt.score = totalScore;
    attempt.totalPoints = totalPoints;
    attempt.passed =
      quiz.passScore != null ? totalScore >= quiz.passScore : null;
    attempt.submittedAt = now;
    attempt.status = isExpired ? "expired" : "submitted";

    await attempt.save();

    return res.json({
      score: totalScore,
      totalPoints,
      results,
      status: attempt.status,
      passed: attempt.passed,
      attempt: {
        _id: attempt._id,
        attemptNumber: attempt.attemptNumber,
        status: attempt.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
