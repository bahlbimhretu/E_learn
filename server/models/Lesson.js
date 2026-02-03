import mongoose from "mongoose";

const lessonSchema = mongoose.Schema(
  {
   course: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "CourseInstance", // instead of "Course"
  required: true,
},

    title: { type: String, required: true },
    content: { type: String }, // text explanation
    videoUrl: { type: String }, // optional - YouTube link or uploaded file
    order: { type: Number, required: true }, // lesson number
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);
