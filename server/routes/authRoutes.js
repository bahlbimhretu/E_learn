import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { forgotPassword, resetPassword } from "../controllers/authController.js";
import { bulkRegisterUsers } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/bulk-register", bulkRegisterUsers);
export default router;
