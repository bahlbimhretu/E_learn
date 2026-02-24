// server/routes/dashboardRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  getStudentDashboardStats,
  getTeacherDashboardStats,
  getAdminDashboardStats,
  getLibraryDashboardStats,
} from "../controllers/dashboardController.js";
import { getHomeroomDashboardStats } from "../controllers/homeroomDashboardController.js";

const router = express.Router();

// Student: any logged-in user (students)
router.get("/student", protect, getStudentDashboardStats);

// Teacher: only teacher or admin
router.get("/teacher", protect, authorize("teacher", "admin"), getTeacherDashboardStats);

// Admin
router.get("/admin", protect, authorize("admin"), getAdminDashboardStats);
router.get(
  "/dashboard/homeroom",
  protect,
  authorize("homeroomTeacher"),
  getHomeroomDashboardStats
);
// Library admin
router.get("/library", protect, authorize("library-admin", "admin"), getLibraryDashboardStats);

export default router;
