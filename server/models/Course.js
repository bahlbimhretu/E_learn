import mongoose from "mongoose";

const courseSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ NEW — OPTIONAL, SAFE
    assignedTo: [
      {
        teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        grade: String,
        section: String,
      },
    ],

    thumbnail: String,
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
