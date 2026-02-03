import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  getStudents,
  getStudentById,
  updateStudentStatus,
} from "../controllers/adminStudentController.js";

const router = express.Router();

router.get(
  "/students",
  protect,
  authorize("admin"),
  getStudents
);

router.get(
  "/students/:id",
  protect,
  authorize("admin"),
  getStudentById
);

router.patch(
  "/students/:id/status",
  protect,
  authorize("admin"),
  updateStudentStatus
);


export default router;
