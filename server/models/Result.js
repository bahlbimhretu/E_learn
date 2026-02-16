import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema(
  {
    quiz1: { type: Number, default: 0, min: 0, max: 10 },
    mid: { type: Number, default: 0, min: 0, max: 20 },
    quiz2: { type: Number, default: 0, min: 0, max: 10 },
    participation: { type: Number, default: 0, min: 0, max: 10 },
    final: { type: Number, default: 0, min: 0, max: 50 },
    total: { type: Number, default: 0 },
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    courseInstance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseInstance",
      required: true,
    },

    academicYear: { type: String, required: true },
    grade: String,
    section: String,

    semester1: { type: semesterSchema, default: () => ({}) },
    semester2: { type: semesterSchema, default: () => ({}) },

    yearTotal: { type: Number, default: 0 },
    yearFinalScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

resultSchema.index(
  { student: 1, courseInstance: 1 },
  { unique: true }
);

// 🔥 Calculate totals
function calculateSemesterTotal(semester) {
  return (
    (semester.quiz1 || 0) +
    (semester.mid || 0) +
    (semester.quiz2 || 0) +
    (semester.participation || 0) +
    (semester.final || 0)
  );
}

// ✅ Async style middleware (no next)
resultSchema.pre("save", async function () {
  this.semester1 = this.semester1 || {};
  this.semester2 = this.semester2 || {};

  this.semester1.total = calculateSemesterTotal(this.semester1);
  this.semester2.total = calculateSemesterTotal(this.semester2);

  this.yearTotal = (this.semester1.total || 0) + (this.semester2.total || 0);
  this.yearFinalScore = this.yearTotal / 2;
});

export default mongoose.model("Result", resultSchema);
