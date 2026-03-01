import mongoose from "mongoose";
import ClassRoom from "../models/ClassRoom.js";
import CourseInstance from "../models/CourseInstance.js";
import User from "../models/Users.js";
import Result from "../models/Result.js"; // Ensure Result is imported

/**
 * 🔹 FETCH STUDENTS WITH AVERAGES
 * Call this from your frontend to display the list before promoting
 */



export const getStudentsWithAverages = async (req, res) => {
  // 1. Get the ID from URL params (matching your frontend call)
  const { classRoomId } = req.params;

  try {
    // 2. Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(classRoomId)) {
      return res.status(400).json({ message: "Invalid Classroom ID format" });
    }

    // 3. Find students matching that classroom ID
    const students = await User.find({
      role: "student",
      status: "active",
      "studentProfile.classRoom": new mongoose.Types.ObjectId(classRoomId),
    }).lean();

    // 4. Calculate averages
    const studentsWithGrades = await Promise.all(
      students.map(async (student) => {
        const results = await Result.find({ student: student._id });
        
        let totalAverage = 0;
        if (results.length > 0) {
          const sum = results.reduce((acc, curr) => acc + (curr.yearFinalScore || 0), 0);
          totalAverage = (sum / results.length).toFixed(2);
        }

        return {
          ...student,
          finalAverage: totalAverage, 
        };
      })
    );

    res.json(studentsWithGrades);
  } catch (error) {
    console.error("Fetch Averages Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * 🔹 PROMOTE CLASS LOGIC
 * Corrected to fix "Grade 13" bug and handle failed/graduated students
 */
export const promoteClass = async (req, res) => {
  const {
    oldClassId,
    newAcademicYear,
    newGrade,
    newSection,
    failedStudentIds = []
  } = req.body;

  try {
    // 1️⃣ Validate old class
    const oldClass = await ClassRoom.findById(oldClassId);
    if (!oldClass) {
      return res.status(404).json({ message: "Old class not found" });
    }

    if (oldClass.status === "archived") {
      return res.status(400).json({ message: "Class already archived" });
    }

    // 2️⃣ Get active students specifically in this class
    const students = await User.find({
      role: "student",
      status: "active",
      "studentProfile.classRoom": oldClassId
    });

    if (!students.length) {
      return res.status(400).json({ message: "No students found in class" });
    }

    // 3️⃣ Create new classroom
    const newClass = await ClassRoom.create({
      academicYear: newAcademicYear,
      grade: newGrade,
      section: newSection,
      createdBy: req.user._id,
    });

    // 4️⃣ Process each student
    for (const student of students) {
      const studentIdStr = student._id.toString();
      // Normalize grade to avoid "Grade 12" vs "grade 12" mismatch
      const currentGradeClean = student.studentProfile.grade?.trim().toLowerCase();

      // ❌ CASE 1: Student Failed/Repeat
      if (failedStudentIds.includes(studentIdStr)) {
        // We move them to the NEW academic year, but keep OLD grade and OLD section
        student.studentProfile.academicYear = newAcademicYear;
        // They stay in the "old" grade level but are usually unassigned from the new class
        // unless you want them in a specific repeater class.
        await student.save();
        continue; 
      }

      // 🎓 CASE 2: Graduation Logic
      if (currentGradeClean === "grade 12") {
        student.status = "graduated";
        student.studentProfile.classRoom = null; // Remove from active classroom tracking
        await student.save();
        continue; // DO NOT promote to next grade
      }

      // ✅ CASE 3: Standard Promotion
      student.studentProfile.grade = newGrade;
      student.studentProfile.academicYear = newAcademicYear;
      student.studentProfile.section = newSection;
      student.studentProfile.classRoom = newClass._id;

      await student.save();

      // 5️⃣ Auto-Enroll into new course instances
      await CourseInstance.updateMany(
        { classRoom: newClass._id, status: "active" },
        { $addToSet: { students: student._id } }
      );
    }

    // 6️⃣ Archive old class
    oldClass.status = "archived";
    await oldClass.save();

    // 7️⃣ Archive old course instances
    await CourseInstance.updateMany(
      { classRoom: oldClassId },
      { status: "archived" }
    );

    res.json({
      message: "Promotion completed successfully",
      newClassId: newClass._id,
    });

  } catch (error) {
    console.error("Promotion error:", error);
    res.status(500).json({ message: error.message });
  }
};