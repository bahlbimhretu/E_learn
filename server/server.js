import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import { authorize } from "./middleware/roleMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import cors from "cors";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import path from "path";
import adminStudentRoutes from "./routes/adminStudentRoutes.js";
import "./models/CourseInstance.js";
import "./models/Users.js";   // User model with post-save hook
import announcementRoutes from "./routes/announcementRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
// app.js or server.js
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
dotenv.config();
connectDB(); // <-- CONNECT DB FIRST

const app = express();

app.use(express.json());


app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));
app.get("/__ping", (req, res) => {
  res.send("PING OK");
});

// Routes
app.use("/api/auth", authRoutes);
// Protected user routes
app.use("/api/users", userRoutes);
// Course routes
app.use("/api/courses", courseRoutes);
app.use("/api/homeroom/messages", homeroomMessageRoutes);
// Homeroom routes
app.use("/api/homeroom", homeroomRoutes);
//upload module
app.use("/api/materials", materialRoutes);
//lesson 
app.use("/api/lessons", lessonRoutes);
// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
//enrollment srever
app.use("/api/enrollments", enrollmentRoutes);
// Dashboard routes
app.use("/api/dashboard", dashboardRoutes);
// Admin routes
app.use("/api/admin", adminRoutes);
// Announcement routes
app.use("/api/announcements", announcementRoutes);
// Admin User Management routes
app.use("/api/admin/users", adminUserRoutes);
//

app.use("/api/admin", adminStudentRoutes);
app.use("/api/classrooms", classRoomRoutes);
//student routes
app.use("/api/student", studentRoutes);
app.use("/api/student", studentExerciseRoutes);
app.use("/api/student", studentQuizAttemptRoutes);

// Question routes
app.use("/api", questionRoutes);

// Quiz routes
app.use("/api/quizzes", quizRoutes);
// student quiz routes
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);

app.use("/api/attendance", attendanceRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/progress", progressRoutes);
// Test routes
app.get("/", (req, res) => {
  res.send("API running...");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Protected route accessed!", user: req.user });
});
app.use("/uploads", express.static("uploads"));

app.get("/api/test/protect", protect, (req, res) => {
  res.json({ message: "Protected OK", user: req.user });
});

app.get("/api/test/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Admin route OK", user: req.user });
});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
