import express from "express";
import {
  getMyCourseInstances,
  getMyCourseInstanceById,

} from "../controllers/teacherCourseInstance.js";
import { protect } from "../middleware/authMiddleware.js";  
import { teacherOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, teacherOnly);


router.get("/course-instances", getMyCourseInstances);
router.get("/course-instances/:id", getMyCourseInstanceById);

export default router;
