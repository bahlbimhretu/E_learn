import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "./adminUserController.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getAllUsers);
router.post("/", protect, authorize("admin"), createUser);
router.put("/:id", protect, authorize("admin"), updateUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;
