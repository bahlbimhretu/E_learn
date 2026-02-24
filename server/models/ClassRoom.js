import mongoose from "mongoose";

const classRoomSchema = new mongoose.Schema(
  {
    academicYear: {
      type: String,
      required: true,
    },

    grade: {
      type: String,
      required: true,
    },

    section: {
      type: String,
      required: true,
    },

    homeRoomTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate class per year
classRoomSchema.index(
  { academicYear: 1, grade: 1, section: 1 },
  { unique: true }
);

export default mongoose.model("ClassRoom", classRoomSchema);