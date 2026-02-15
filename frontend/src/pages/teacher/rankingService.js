import SectionResultSummary from "../models/SectionResultSummary.js";

export const recalculateSectionRanking = async (
  academicYear,
  grade,
  section
) => {
  // 🔹 Get all students in this section
  const students = await SectionResultSummary.find({
    academicYear,
    grade,
    section,
  }).sort({ semester1Total: -1 });

  // =============================
  // 🔹 SEMESTER 1 RANKING
  // =============================
  assignRanks(students, "semester1Total", "semester1Rank");

  // =============================
  // 🔹 SEMESTER 2 RANKING
  // =============================
  const sem2Students = await SectionResultSummary.find({
    academicYear,
    grade,
    section,
  }).sort({ semester2Total: -1 });

  assignRanks(sem2Students, "semester2Total", "semester2Rank");

  // =============================
  // 🔹 YEAR RANKING
  // =============================
  const yearStudents = await SectionResultSummary.find({
    academicYear,
    grade,
    section,
  }).sort({ yearFinalScore: -1 });

  assignRanks(yearStudents, "yearFinalScore", "yearRank");

  console.log(
    `Ranking recalculated for Grade ${grade}${section} - ${academicYear}`
  );
};
const assignRanks = async (students, scoreField, rankField) => {
  let currentRank = 1;
  let previousScore = null;

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const score = student[scoreField];

    if (score === previousScore) {
      // Same rank as previous
      student[rankField] = currentRank;
    } else {
      // New rank
      currentRank = i + 1;
      student[rankField] = currentRank;
      previousScore = score;
    }

    await student.save();
  }
};
