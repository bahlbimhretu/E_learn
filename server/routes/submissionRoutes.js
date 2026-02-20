import express from "express";
import multer from "multer";

// In your routes file
import { 
  submitAssignment, 
  getSubmissionsByAssignment, 
  gradeSubmission,
  getStudentSubmissions // Import it here
} from "../controllers/submissionController.js";

// ... other routes ...

// Add this route

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and Word files allowed"));
    }
  }
});
// Student submits assignment
router.post(
  "/:id/submit",
  protect,
  authorize("student"),
  upload.single("file"),
  submitAssignment
);

// Teacher views submissions
router.get(
  "/assignment/:assignmentId",
  protect,
  authorize("teacher"),
  getSubmissionsByAssignment
);

// Teacher grades submission
router.put(
  "/grade/:submissionId",
  protect,
  authorize("teacher"),
  gradeSubmission
);
// Student views their own submissions
router.get(
  "/my-submissions", 
  protect, 
  authorize("student"), 
  getStudentSubmissions // You'll need to create this in your controller
);
router.get(
  "/my-submissions", 
  protect, 
  authorize("student"), 
  getStudentSubmissions
);

export default router;
