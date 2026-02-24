import mongoose from "mongoose";

const attendancePolicySchema = new mongoose.Schema({
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear",
    required: true,
    unique: true
  },

  minimumPercentageRequired: {
    type: Number,
    default: 75
  },

  lateEquivalentRatio: {
    type: Number,
    default: 3   // 3 lates = 1 absence
  },

  autoWarningEnabled: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model("AttendancePolicy", attendancePolicySchema);