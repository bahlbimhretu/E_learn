// controllers/announcementController.js
import { Announcement } from "../models/Announcement.js";
import User from "../models/Users.js";

/**
 * GET /api/announcements
 * Admin / Teacher: list all announcements
 */
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch announcements" });
  }
};

/**
 * POST /api/announcements
 * Admin / Teacher: create announcement
 */
export const createAnnouncement = async (req, res) => {
  try {
    const { title, message, contentHtml, audience, status } = req.body;

const announcement = await Announcement.create({
  title,
  contentHtml: contentHtml || message, // fallback
  audience,
  status,
  createdBy: req.user._id,
  creatorRole: req.user.role,
  publishedAt: status === "published" ? new Date() : null,
});

if (!title || !(contentHtml || message)) {
  return res.status(400).json({
    message: "Title and content are required",
  });
}

    res.status(201).json(announcement);
  } catch (err) {
    res.status(400).json({ message: "Failed to create announcement" });
  }
};

/**
 * PUT /api/announcements/:id
 * Admin / Teacher: update announcement
 */
export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // Optional: only creator or admin can edit
    if (
      req.user.role !== "admin" &&
      announcement.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    Object.assign(announcement, req.body);

    if (
      req.body.status === "published" &&
      !announcement.publishedAt
    ) {
      announcement.publishedAt = new Date();
    }

    await announcement.save();

    res.json(announcement);
  } catch (err) {
    res.status(400).json({ message: "Failed to update announcement" });
  }
};

/**
 * PATCH /api/announcements/:id/archive
 * Soft archive
 */
export const archiveAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    announcement.status = "archived";
    announcement.isArchived = true;

    await announcement.save();

    res.json({ message: "Announcement archived" });
  } catch (err) {
    res.status(500).json({ message: "Failed to archive announcement" });
  }
};

/**
 * GET /api/announcements/feed
 * Student / Teacher / Parent
 */
/**
 * GET /api/announcements/feed
 * Student / Teacher / Parent
 */
export const getAnnouncementFeed = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized (no user)" });
    }

    const role = req.user.role;

    let grade = null;
    let section = null;

    // If student → get grade/section
    if (role === "student") {
      grade = req.user.studentProfile?.grade;
      section = req.user.studentProfile?.section;
    }

    // If parent → use first child (for now)
    if (role === "parent") {
      const child = await User.findOne({
        guardian: req.user._id,
      });

      if (child) {
        grade = child.studentProfile?.grade;
        section = child.studentProfile?.section;
      }
    }

    const baseQuery = {
      status: "published",
      isArchived: false,
      "audience.roles": role,
    };

    const gradeCondition = grade
      ? {
          $or: [
            { "audience.grades": { $size: 0 } },
            { "audience.grades": grade },
          ],
        }
      : {};

    const sectionCondition = section
      ? {
          $or: [
            { "audience.sections": { $size: 0 } },
            { "audience.sections": section },
          ],
        }
      : {};

    const announcements = await Announcement.find({
      ...baseQuery,
      $and: [gradeCondition, sectionCondition],
    })
      .sort({ publishedAt: -1 })
      .limit(50)
      .select("title contentHtml publishedAt createdAt");

    res.json(announcements);
  } catch (err) {
    console.error("FEED ERROR:", err);
    res.status(500).json({ message: "Failed to load feed" });
  }
};


/**
 * GET /api/announcements/:id
 * Admin / Teacher: get announcement details
 */
export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate("createdBy", "name email role");

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch announcement" });
  }
};

