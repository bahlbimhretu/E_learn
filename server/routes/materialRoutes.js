import express from "express";
import {
  uploadMaterial,
  getMaterialsByLesson,
  deleteMaterial,
} from "../controllers/materialController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/**
 * Upload material for a lesson
 * Teacher / Admin only
 */
router.post(
  "/",
  protect,
  authorize("teacher", "admin"),
  upload.single("file"),
  uploadMaterial
);

/**
 * Get materials for a specific lesson
 * Student / Teacher / Admin
 */
router.get(
  "/lesson/:lessonId",
  protect,
  authorize("student", "teacher", "admin"),
  getMaterialsByLesson
);

/**
 * Delete material
 * Admin OR owner teacher
 */
router.delete(
  "/:id",
  protect,
  authorize("teacher", "admin"),
  deleteMaterial
);

export default router;
