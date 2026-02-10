import Quiz from "../models/Quiz.js";
import Lesson from "../models/Lesson.js";
import CourseInstance from "../models/CourseInstance.js";

/**
 * CREATE QUIZ FOR A LESSON
 * POST /api/lessons/:lessonId/quiz
 */
export const createQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const {
      title,
      instructions,
      timeLimit,
      attemptsAllowed,
      passScore,
      randomizeQuestions,
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔎 Check lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // 🔐 Permission: creator or admin
    if (
      req.user.role !== "admin" &&
      lesson.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed to create quiz" });
    }

    // 🚫 Enforce one quiz per lesson
    const existingQuiz = await Quiz.findOne({ lesson: lessonId });
    if (existingQuiz) {
      return res
        .status(400)
        .json({ message: "Quiz already exists for this lesson" });
    }

    // 🔎 Load course instance
    const course = await CourseInstance.findById(lesson.course);
    if (!course) {
      return res.status(404).json({ message: "Course instance not found" });
    }

    // 🧠 Create quiz
    const quiz = await Quiz.create({
      lesson: lesson._id,
      course: course._id,
      createdBy: req.user._id,
      title: title || `${lesson.title} Quiz`,
      instructions,
      timeLimit: timeLimit ?? null,
      attemptsAllowed: attemptsAllowed ?? 1,
      passScore: passScore ?? null,
      randomizeQuestions: randomizeQuestions ?? false,
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
/**
 * UPDATE QUIZ SETTINGS
 * PUT /api/quizzes/:quizId
 */
export const updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // 🔐 Permission
    if (
      req.user.role !== "admin" &&
      quiz.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed to update quiz" });
    }

    // 📝 Update allowed fields
    quiz.title = req.body.title ?? quiz.title;
    quiz.instructions = req.body.instructions ?? quiz.instructions;
    quiz.timeLimit =
      req.body.timeLimit !== undefined ? req.body.timeLimit : quiz.timeLimit;
    quiz.attemptsAllowed =
      req.body.attemptsAllowed ?? quiz.attemptsAllowed;
    quiz.passScore =
      req.body.passScore !== undefined ? req.body.passScore : quiz.passScore;
    quiz.randomizeQuestions =
      req.body.randomizeQuestions ?? quiz.randomizeQuestions;

    // 🚫 Don’t allow editing published quiz structure (policy choice)
    if (quiz.status === "published") {
      return res
        .status(400)
        .json({ message: "Unpublish quiz before editing settings" });
    }

    const updatedQuiz = await quiz.save();
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * PUBLISH / UNPUBLISH QUIZ
 * PATCH /api/quizzes/:quizId/publish
 */
export const togglePublishQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // 🔐 Permission
    if (
      req.user.role !== "admin" &&
      quiz.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed to publish quiz" });
    }

    quiz.status = quiz.status === "draft" ? "published" : "draft";
    await quiz.save();

    res.json({
      message: `Quiz ${quiz.status}`,
      status: quiz.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
