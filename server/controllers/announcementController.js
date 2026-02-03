// controllers/announcementController.js
import { Announcement } from "../models/Announcement.js";

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
export const getAnnouncementFeed = async (req, res) => {
  try {
    const role = req.user.role;

    const announcements = await Announcement.find({
      status: "published",
      isArchived: false,
      $or: [
        { audience: "all" },
        { audience: role + "s" }, // student → students
      ],
    })
      .sort({ publishedAt: -1 })
      .limit(50);

    res.json(announcements);
  } catch (err) {
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

