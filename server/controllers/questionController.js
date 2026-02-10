import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";

/**
 * Utility: Recalculate total quiz points
 */
const recalculateTotalPoints = async (quizId) => {
  const result = await Question.aggregate([
    { $match: { quiz: quizId } },
    { $group: { _id: null, total: { $sum: "$points" } } },
  ]);

  const totalPoints = result[0]?.total || 0;
  await Quiz.findByIdAndUpdate(quizId, { totalPoints });
};

/**
 * ADD QUESTION
 * POST /api/quizzes/:quizId/questions
 */
export const addQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { type, text, options, correctAnswers, points, order } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔎 Load quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // 🚫 Don’t allow editing published quiz
    if (quiz.status === "published") {
      return res
        .status(400)
        .json({ message: "Unpublish quiz before modifying questions" });
    }

    // 🔐 Permission
    if (
      req.user.role !== "admin" &&
      quiz.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed to add question" });
    }

    // 🧪 Basic validation
    if (!type || !text || !points || order == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🧠 Create question
    const question = await Question.create({
      quiz: quizId,
      type,
      text,
      options: options || [],
      correctAnswers,
      points,
      order,
    });

    // 🔄 Update quiz total points
    await recalculateTotalPoints(quizId);

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * GET QUESTIONS
 * GET /api/quizzes/:quizId/questions
 */
export const getQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // 🚫 Don’t allow viewing questions of unpublished quizzes if not owner/admin
    if (
      quiz.status !== "published" &&
      req.user.role !== "admin" &&
      quiz.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed to view questions" });
    }

    const questions = await Question.find({ quiz: quizId }).sort({ order: 1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE QUESTION
 * PUT /api/questions/:id
 */
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const quiz = await Quiz.findById(question.quiz);

    // 🚫 Don’t allow editing published quiz
    if (quiz.status === "published") {
      return res
        .status(400)
        .json({ message: "Unpublish quiz before editing questions" });
    }

    // 🔐 Permission
    if (
      req.user.role !== "admin" &&
      quiz.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed to update question" });
    }

    // 📝 Update fields
    question.type = req.body.type ?? question.type;
    question.text = req.body.text ?? question.text;
    question.options = req.body.options ?? question.options;
    question.correctAnswers =
      req.body.correctAnswers ?? question.correctAnswers;
    question.points = req.body.points ?? question.points;
    question.order = req.body.order ?? question.order;

    const updatedQuestion = await question.save();

    // 🔄 Recalculate total points
    await recalculateTotalPoints(question.quiz);

    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * DELETE QUESTION
 * DELETE /api/questions/:id
 */
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const quiz = await Quiz.findById(question.quiz);

    // 🚫 Don’t allow editing published quiz
    if (quiz.status === "published") {
      return res
        .status(400)
        .json({ message: "Unpublish quiz before deleting questions" });
    }

    // 🔐 Permission
    if (
      req.user.role !== "admin" &&
      quiz.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed to delete question" });
    }

    await question.deleteOne();

    // 🔄 Recalculate total points
    await recalculateTotalPoints(question.quiz);

    res.json({ message: "Question deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
