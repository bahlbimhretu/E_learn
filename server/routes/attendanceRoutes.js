import express from "express";
import {
  createAttendanceSession,
  submitAttendanceRecords,
  getStudentAttendanceSummary,
  getClassAttendanceByDate,
  getMonthlyAttendanceReport,
  getParentViewData
} from "../controllers/attendanceController.js";
import { getStudentAttendance,
  getAcademicYears
 } from "../controllers/studentAttendance.js";

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
// Add this route to your existing list
router.get("/my-children", protect, authorize("parent"), async (req, res) => {
  try {
    // The 'protect' middleware already populated the user
    // We just need to find the students linked in parentProfile.children
    const parent = await User.findById(req.user._id).populate("parentProfile.children", "name _id avatar");
    
    res.json(parent.parentProfile.children);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
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

router.get("/parent/:studentId", 
  protect,
  authorize("parent"),
getParentViewData
);

//student view of their attendance records
router.get("/student", protect, 
  authorize("student"),
  getStudentAttendance);
  router.get("/academic-years",
    protect,
    authorize("student"),
    getAcademicYears
  );
export default router;