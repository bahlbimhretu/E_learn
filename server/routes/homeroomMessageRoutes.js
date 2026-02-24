import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  sendMessage,
  getConversation
} from "../controllers/homeroomMessageController.js";

const router = express.Router();

router.post("/:studentId", protect, authorize("teacher","parent"), sendMessage);
router.get("/:studentId", protect, authorize("teacher", "parent"), getConversation);
export default router;