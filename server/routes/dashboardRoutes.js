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

const router = express.Router();

// Student: any logged-in user (students)
router.get("/student", protect, getStudentDashboardStats);

// Teacher: only teacher or admin
router.get("/teacher", protect, authorize("teacher", "admin"), getTeacherDashboardStats);

// Admin
router.get("/admin", protect, authorize("admin"), getAdminDashboardStats);

// Library admin
router.get("/library", protect, authorize("library-admin", "admin"), getLibraryDashboardStats);

export default router;
