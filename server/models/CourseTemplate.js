import mongoose from "mongoose";

const courseTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      uppercase: true,
      unique: true, // PHY-10
    },

    grade: {
      type: String,
      enum: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
      required: true,
    },

    description: {
      type: String,
    },
     thumbnail: {
      type: String, // URL or path
      default: "/course-thumbnail/course-default.png",
    },
    creditHours: {
      type: Number,
      default: 4,
      min: 1,
    },

    category: {
      type: String,
      enum: ["Science", "Language", "Math", "Social", "ICT", "Other"],
      default: "Other",
    },

    isElective: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CourseTemplate", courseTemplateSchema);
