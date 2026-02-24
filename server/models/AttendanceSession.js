import mongoose from "mongoose";

const attendanceSessionSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true
    },

    courseInstance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseInstance",
      default: null
    },

    sessionDate: {
      type: Date,
      required: true,
      index: true
    },

    sessionType: {
      type: String,
      enum: ["DAILY", "SUBJECT"],
      required: true
    },

    periodNumber: {
      type: Number,
      default: null
    },

    academicYear: {
    type: String, required: true ,
      ref: "AcademicYear",
      required: true,
      index: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true
    },

    isLocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

/**
 * Prevent duplicate DAILY sessions per class per date
 */
attendanceSessionSchema.index(
  { class: 1, sessionDate: 1, sessionType: 1, academicYear: 1 },
  { unique: true }
);

export default mongoose.model("AttendanceSession", attendanceSessionSchema);