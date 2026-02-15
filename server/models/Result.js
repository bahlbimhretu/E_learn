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

    academicYear: {
      type: String,
      required: true,
    },

    grade: String,
    section: String,

    semester1: semesterSchema,
    semester2: semesterSchema,

    yearTotal: { type: Number, default: 0 }, // sem1 + sem2
    yearFinalScore: { type: Number, default: 0 }, // (sem1 + sem2) / 2
  },
  { timestamps: true }
);

// 🚫 Prevent duplicate subject result per student
resultSchema.index(
  { student: 1, courseInstance: 1 },
  { unique: true }
);
// 🔹 Pre-save hook to calculate totals and final score
function calculateSemesterTotal(semester) {
  if (!semester) return 0;

  return (
    (semester.quiz1 || 0) +
    (semester.mid || 0) +
    (semester.quiz2 || 0) +
    (semester.participation || 0) +
    (semester.final || 0)
  );
}
//
resultSchema.pre("save", function (next) {
  // 🔹 Calculate semester totals
  this.semester1.total = calculateSemesterTotal(this.semester1);
  this.semester2.total = calculateSemesterTotal(this.semester2);

  // 🔹 Calculate yearly totals
  this.yearTotal =
    (this.semester1.total || 0) + (this.semester2.total || 0);

  this.yearFinalScore = this.yearTotal / 2;

  next();
});
resultSchema.pre("save", function (next) {
  // 🔹 Calculate semester totals
  this.semester1.total = calculateSemesterTotal(this.semester1);
  this.semester2.total = calculateSemesterTotal(this.semester2);

  // 🔹 Calculate yearly totals
  this.yearTotal =
    (this.semester1.total || 0) + (this.semester2.total || 0);

  this.yearFinalScore = this.yearTotal / 2;

  next();
});


export default mongoose.model("Result", resultSchema);
