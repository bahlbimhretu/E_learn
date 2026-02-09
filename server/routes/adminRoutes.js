import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { getAdminStats } from "../controllers/adminController.js";
import { getGrades } from "../controllers/adminController.js";
import { getTeachers } from "../controllers/adminUserControllers.js";
import uploadCourseThumbnail from "../middleware/uploadCourseThumbnail.js";
import {
  createCourseTemplate,
  getCourseTemplates, 
  getCourseTemplateById,
  updateCourseTemplate,
  archiveCourseTemplate
} from "../controllers/courseController.js";
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  archiveAnnouncement,
  getAnnouncementFeed,
} from "../controllers/announcementController.js";
import { restoreCourseTemplate } from "../controllers/courseController.js";
import {
  createCourseInstance,
  getCourseInstances,
  assignTeacher,
  archiveCourseInstance,
  getCourseInstanceById,
  updateCourseInstance,
  restoreCourseInstance,
} from "../controllers/adminCourseInstanceController.js";

const router = express.Router();

router.get("/stats", protect, authorize("admin"), getAdminStats);
router.get("/grades", protect, authorize("admin"), getGrades);
router.get(
  "/teachers",
  protect,
  authorize("admin"),
  getTeachers
);
// Course Template routes
router.post(
  "/course-templates",
  protect,
  authorize("admin"),
  uploadCourseThumbnail.single("thumbnail"),
  createCourseTemplate
);

router.get(
  "/course-templates",
  protect,
  authorize("admin"),
  getCourseTemplates
);

router.get(
  "/course-templates/:id",
  protect,
  authorize("admin"),
  getCourseTemplateById
);

router.put(
  "/course-templates/:id",
  protect,
  authorize("admin"),
  uploadCourseThumbnail.single("thumbnail"),
  updateCourseTemplate
);

router.patch(
  "/course-templates/:id/archive",
  protect,
  authorize("admin"),
  archiveCourseTemplate
);

router.patch(
  "/course-templates/:id/restore",
  protect,
  authorize("admin"),
  restoreCourseTemplate
);


//course instance routes 
router.post(
  "/course-instances",
  protect,
  authorize("admin"),
  createCourseInstance
);

router.get(
  "/course-instances",
  protect,
  authorize("admin"),
  getCourseInstances
);

router.patch(
  "/course-instances/:id/assign-teacher",
  protect,
  authorize("admin"),
  assignTeacher
);

router.patch(
  "/course-instances/:id/archive",
  protect,
  authorize("admin"),
  archiveCourseInstance
);

router.get(
  "/course-instances/:id",
  protect,
  authorize("admin"),
  getCourseInstanceById
);
// routes/adminRoutes.js
router.patch(
  "/course-instances/:id/restore",
  protect,
  authorize("admin"),
  restoreCourseInstance
);

router.put(
  "/course-instances/:id",
  protect,
  authorize("admin"),
  updateCourseInstance
);
export default router;


