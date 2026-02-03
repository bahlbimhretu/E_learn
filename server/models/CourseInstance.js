import mongoose from "mongoose";

const courseInstanceSchema = new mongoose.Schema(
  {
    // 🔹 Link to reusable template
    courseTemplate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseTemplate",
      required: true,
    },

    // 🔹 Academic context
    academicYear: {
      type: String,
      required: true, // "2024/2025"
    },

    grade: {
      type: String,
      required: true, // Grade 9–12
    },

    section: {
      type: String,
      required: true, // A, B, C...
    },

    // 🔹 Teacher (single teacher for now)
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 🔹 Enrolled students (snapshot)
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 🔹 Status lifecycle
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },

    // 🔹 Audit
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// 🚫 Prevent duplicate instances
courseInstanceSchema.index(
  {
    courseTemplate: 1,
    academicYear: 1,
    grade: 1,
    section: 1,
  },
  { unique: true }
);

export default mongoose.model("CourseInstance", courseInstanceSchema);
