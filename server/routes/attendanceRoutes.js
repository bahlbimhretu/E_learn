import express from "express";
import {
  createAttendanceSession,
  submitAttendanceRecords,
  getStudentAttendanceSummary,
  getClassAttendanceByDate,
  getMonthlyAttendanceReport
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
const router = express.Router();

/**
 * Create session (Homeroom or Subject)
 */
router.post(
  "/session",
  protect,
  authorize("teacher"),
  createAttendanceSession
);

/**
 * Submit student attendance records
 */
router.post(
  "/session/:sessionId/records",
  protect,
  authorize("teacher"),
  submitAttendanceRecords
);

/**
 * Get student attendance summary
 */
router.get(
  "/student/:studentId",
  protect,
  getStudentAttendanceSummary
);

router.get(
  "/report/:classId",
  protect,
  authorize("teacher"),
  getMonthlyAttendanceReport
);
/**
 * Get class attendance by date
 */
router.get(
  "/class/:classId",
  protect,
  getClassAttendanceByDate
);

export default router;