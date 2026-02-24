import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

import { getHomeroomDashboard } from "../controllers/homeroomController.js";
import { getHomeroomPerformance ,
        getStudentPerformanceReport
} from "../controllers/homeroomPerformanceController.js";

const router = express.Router();

router.use(protect, authorize("teacher"));

/* Dashboard */
router.get("/dashboard", getHomeroomDashboard);

/* ✅ Performance Analytics */
router.get("/performance", getHomeroomPerformance);
router.get(
  "/student/:studentId/report",
  getStudentPerformanceReport
);
export default router;