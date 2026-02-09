// routes/announcementRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  archiveAnnouncement,
  getAnnouncementFeed,
} from "../controllers/announcementController.js";

const router = express.Router();

/**
 * Management (Admin / Teacher)
 */
router.get(
  "/manage",
  protect,
  authorize("admin", "teacher"),
  getAnnouncements
);

router.post(
  "/manage",
  protect,
  authorize("admin", "teacher"),
  createAnnouncement
);

router.put(
  "/manage/:id",
  protect,
  authorize("admin", "teacher"),
  updateAnnouncement
);

router.patch(
  "/manage/:id/archive",
  protect,
  authorize("admin"),
  archiveAnnouncement
);

/**
 * Public feed (role-filtered)
 */
router.get(
  "/feed",
  protect,
  authorize("student", "teacher", "parent"),
  getAnnouncementFeed
);

/**
 * Single announcement
 */
router.get(
  "/:id",
  protect,
  getAnnouncementById
);

export default router;
