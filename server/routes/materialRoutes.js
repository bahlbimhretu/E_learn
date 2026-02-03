import express from "express";
import {
  uploadMaterial,
  getMaterialsByCourse,
  deleteMaterial
} from "../controllers/materialController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  authorize("teacher", "admin"),
  upload.single("file"),
  uploadMaterial
);

router.get("/course/:courseId", protect, getMaterialsByCourse);

router.delete(
  "/:id",
  protect,
  authorize("admin", "teacher"),
  deleteMaterial
);

export default router;
