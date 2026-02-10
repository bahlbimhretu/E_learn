import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    // 🔗 Relationships
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
      unique: true, // ✅ Enforces ONE quiz per lesson
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseInstance",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📝 Quiz meta
    title: {
      type: String,
      required: true,
      trim: true,
    },

    instructions: {
      type: String,
      trim: true,
    },

    // ⏱️ Settings
    timeLimit: {
      type: Number, // minutes
      min: 1,
      default: null, // null = no time limit
    },

    attemptsAllowed: {
      type: Number,
      min: 1,
      default: 1,
    },

    passScore: {
      type: Number,
      min: 0,
      default: null, // null = no pass requirement
    },

    randomizeQuestions: {
      type: Boolean,
      default: false,
    },

    // 📊 Status
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    totalPoints: {
      type: Number,
      default: 0, // computed from questions
    },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
