import mongoose from "mongoose";

const attendanceRecordSchema = new mongoose.Schema(
  {
    attendanceSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AttendanceSession",
      required: true,
      index: true
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "LATE", "EXCUSED"],
      required: true
    },

    remark: {
      type: String,
      default: null
    },

    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null
    }
  },
  { timestamps: true }
);

/**
 * Prevent duplicate student entry in same session
 */
attendanceRecordSchema.index(
  { attendanceSession: 1, student: 1 },
  { unique: true }
);

export default mongoose.model("AttendanceRecord", attendanceRecordSchema);