import mongoose from "mongoose";

const sectionResultSummarySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    academicYear: {
      type: String,
      required: true,
    },

    grade: String,
    section: String,

    semester1Total: { type: Number, default: 0 },
    semester2Total: { type: Number, default: 0 },

    yearTotalRaw: { type: Number, default: 0 }, // sem1 + sem2
    yearFinalScore: { type: Number, default: 0 }, // ÷2

    semester1Rank: { type: Number },
    semester2Rank: { type: Number },
    yearRank: { type: Number },
  },
  { timestamps: true }
);

// 🚫 Prevent duplicate summary per year
sectionResultSummarySchema.index(
  { student: 1, academicYear: 1 },
  { unique: true }
);

export default mongoose.model(
  "SectionResultSummary",
  sectionResultSummarySchema
);
