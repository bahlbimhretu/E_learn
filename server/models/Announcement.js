import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    contentHtml: {
      type: String,
      required: true,
    },

    audience: {
      roles: {
        type: [String],
        enum: ["admin", "teacher", "student", "parent"],
        default: ["student", "teacher", "parent"],
      },

      // future-ready (not used yet)
      grades: [{ type: String }],
      sections: [{ type: String }],
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },

    isArchived: {
      type: Boolean,
      default: false,
    
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    creatorRole: {
      type: String,
      enum: ["admin", "teacher"],
      required: true,
    },

    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);
announcementSchema.index({ status: 1, createdAt: -1 });
announcementSchema.index({ "audience.roles": 1 });
announcementSchema.index({ isArchived: 1 });
// models/Announcement.js   
export const Announcement = mongoose.model("Announcement", announcementSchema);
