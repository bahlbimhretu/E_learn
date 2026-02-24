import express from "express";
import {
  createClassRoom,
  getClassRooms,
  getClassRoomById,
  assignHomeRoomTeacher,
  updateClassRoom,
  archiveClassRoom,
} from "../controllers/classRoomController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createClassRoom);
router.get("/", protect, getClassRooms);
router.get("/:id", protect, getClassRoomById);

router.put("/:id", protect, authorize("admin"), updateClassRoom);
router.put("/:id/archive", protect, authorize("admin"), archiveClassRoom);

router.put(
  "/:id/assign-homeroom",
  protect,
  authorize("admin"),
  assignHomeRoomTeacher
);

export default router;