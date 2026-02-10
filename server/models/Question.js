import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    // 🔗 Relationship
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },

    // ❓ Question content
    type: {
      type: String,
      enum: ["mcq_single", "mcq_multi", "true_false"],
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    // 🧩 Options (for MCQ & T/F)
    options: {
      type: [optionSchema],
      default: [],
    },

    // ✅ Correct answers
    correctAnswers: {
      type: [Number], // indexes of options[]
      required: true,
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one correct answer is required",
      },
    },

    // 🎯 Scoring
    points: {
      type: Number,
      required: true,
      min: 1,
    },

    // 🔢 Ordering
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
