import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    selectedAnswers: {
      type: [Number],
      default: [],
    },
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    correctAnswers: {
      type: [Number],
      default: [],
    },
    studentAnswers: {
      type: [Number],
      default: [],
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    points: {
      type: Number,
      default: 0,
    },
    pointsAwarded: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseInstance",
    },
    attemptNumber: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["in_progress", "submitted", "expired"],
      default: "in_progress",
      index: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    timeLimitMinutes: {
      type: Number,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
    questionOrder: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    answers: {
      type: [answerSchema],
      default: [],
    },
    results: {
      type: [resultSchema],
      default: [],
    },
    score: {
      type: Number,
      default: 0,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    passScore: {
      type: Number,
      default: null,
    },
    passed: {
      type: Boolean,
      default: null,
    },
  },
  { timestamps: true }
);

quizAttemptSchema.index(
  { quiz: 1, student: 1, attemptNumber: 1 },
  { unique: true }
);

quizAttemptSchema.pre("save", function () {
  if (this.timeLimitMinutes && this.startedAt) {
    this.expiresAt = new Date(
      this.startedAt.getTime() + this.timeLimitMinutes * 60 * 1000
    );
  } else {
    this.expiresAt = null;
  }
});

export default mongoose.model("QuizAttempt", quizAttemptSchema);
