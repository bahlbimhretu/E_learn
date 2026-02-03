import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/Users.js";
import Course from "../models/Course.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});


const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB connected");

    // 1️⃣ Get teachers
    const teachers = await User.find({ role: "teacher" });

    if (!teachers.length) {
      console.log("❌ No teachers found");
      process.exit();
    }

    // 2️⃣ Get courses
    const courses = await Course.find();

    if (!courses.length) {
      console.log("❌ No courses found");
      process.exit();
    }

    // 3️⃣ Simple assignment logic (EDIT FREELY)
    for (let i = 0; i < courses.length; i++) {
      const teacher = teachers[i % teachers.length];

      courses[i].assignedTo = [
        {
          teacher: teacher._id,
          grade: "10",
          section: "A",
        },
      ];

      await courses[i].save();
      console.log(
        `✔ Assigned ${teacher.name} → ${courses[i].title}`
      );
    }

    console.log("🎉 Assignment completed");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

run();
