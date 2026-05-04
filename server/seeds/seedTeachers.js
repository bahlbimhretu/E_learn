import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/Users.js";

dotenv.config({ path: "../.env" });

const seedTeachers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const teachersData = [
      { name: "Abel Tesfay", specialization: "Mathematics" },
      { name: "Sara Yohannes", specialization: "English" },
      { name: "Dawit Gebru", specialization: "Biology" },
      { name: "Marta Alem", specialization: "Physics" },
      { name: "Samuel Tadesse", specialization: "Chemistry" },
      { name: "Ruth Daniel", specialization: "History" },
      { name: "Yonatan Bekele", specialization: "Geography" },
      { name: "Liya Mekonnen", specialization: "Civics" },
      { name: "Henok Assefa", specialization: "ICT" },
      { name: "Bethel Hailu", specialization: "Economics" },
    ];

    // 🔁 Map teachers to proper schema format
    const teachers = teachersData.map((teacher) => {
      const emailName = teacher.name.toLowerCase().replace(/ /g, "");

      return {
        name: teacher.name,
        email: `${emailName}@edu.et`,
        password: "12345678",
        role: "teacher",
        status: "active",
        teacherProfile: {
          specialization: teacher.specialization,
          educationLevel: "Masters",
        },
      };
    });

    // ❗ Avoid duplicates (optional but recommended)
    for (const teacher of teachers) {
      const exists = await User.findOne({ email: teacher.email });
      if (!exists) {
        await User.create(teacher);
        console.log(`✅ Created: ${teacher.email}`);
      } else {
        console.log(`⚠️ Already exists: ${teacher.email}`);
      }
    }

    console.log("🎯 Teacher seeding complete!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding teachers:", error);
    process.exit(1);
  }
};

seedTeachers();

/* console.log("
| #  | Name           | Email                     | Password |
| -- | -------------- | ---------------------    | -------- |
| 1  | Abel Tesfay    | [abeltesfay@edu.et]      | 12345678 |
| 2  | Sara Yohannes  | [sarayohannes@edu.et]   | 12345678 |
| 3  | Dawit Gebru    | [dawitgebru@edu.et]     | 12345678 |
| 4  | Marta Alem     | [martaalem@edu.et]         | 12345678 |
| 5  | Samuel Tadesse | [samueltadesse@edu.et] | 12345678 |
| 6  | Ruth Daniel    | [ruthdaniel@edu.et]       | 12345678 |
| 7  | Yonatan Bekele | [yonatanbekele@edu.et] | 12345678 |
| 8  | Liya Mekonnen  | [liyamekonnen@edu.et]   | 12345678 |
| 9  | Henok Assefa   | [henokassefa@edu.et]   | 12345678 |
| 10 | Bethel Hailu   | [bethelhailu@edu.et]     | 12345678 |


"); */
