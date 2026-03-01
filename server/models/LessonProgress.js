import mongoose from "mongoose";

const lessonProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    completed: {
      type: Boolean,
      default: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/*
Prevent duplicate completion
One student cannot complete same lesson twice
*/
lessonProgressSchema.index(
  { student: 1, lesson: 1 },
  { unique: true }
);

export default mongoose.model("LessonProgress", lessonProgressSchema);