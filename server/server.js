import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import adminStudentRoutes from "./routes/adminStudentRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import studentExerciseRoutes from "./routes/studentExerciseRoutes.js";
import studentQuizAttemptRoutes from "./routes/studentQuizAttemptRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import classRoomRoutes from "./routes/classRoomRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import homeroomRoutes from "./routes/homeroomRoutes.js";
import homeroomMessageRoutes from "./routes/homeroomMessageRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

// Middleware
import { protect } from "./middleware/authMiddleware.js";
import { authorize } from "./middleware/roleMiddleware.js";

// Models (important for hooks)
import "./models/CourseInstance.js";
import "./models/Users.js";

// Init
dotenv.config();
connectDB();

const app = express();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// ✅ CORS (safe for development)
app.use(cors());

// Health check
app.get("/__ping", (req, res) => {
  res.send("PING OK");
});


// ================= API ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/homeroom/messages", homeroomMessageRoutes);
app.use("/api/homeroom", homeroomRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin", adminStudentRoutes);
app.use("/api/classrooms", classRoomRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/student", studentExerciseRoutes);
app.use("/api/student", studentQuizAttemptRoutes);
app.use("/api", questionRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/progress", progressRoutes);

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ================= TEST ROUTES =================

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Protected route accessed!", user: req.user });
});

app.get("/api/test/protect", protect, (req, res) => {
  res.json({ message: "Protected OK", user: req.user });
});

app.get("/api/test/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Admin route OK", user: req.user });
});


// ================= FRONTEND (PWA) =================

// 👇 IMPORTANT: path to your React build
const frontendPath = path.join(__dirname, "../frontend/dist");

// Serve React static files
app.use(express.static(frontendPath));

// SPA fallback (VERY IMPORTANT)
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});
// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});