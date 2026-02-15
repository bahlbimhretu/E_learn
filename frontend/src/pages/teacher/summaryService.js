import Result from "../models/Result.js";
import SectionResultSummary from "../models/SectionResultSummary.js";
import { recalculateSectionRanking } from "./rankingService.js";

export const recalculateStudentSummary = async (
  studentId,
  academicYear,
  grade,
  section
) => {
  // 🔹 Get all subject results for this student
  const results = await Result.find({
    student: studentId,
    academicYear,
  });

  if (!results.length) return;

  let semester1Total = 0;
  let semester2Total = 0;

  for (const result of results) {
    semester1Total += result.semester1.total || 0;
    semester2Total += result.semester2.total || 0;
  }

  const yearTotalRaw = semester1Total + semester2Total;
  const yearFinalScore = yearTotalRaw / 2;

  // 🔹 Upsert summary
  await SectionResultSummary.findOneAndUpdate(
    { student: studentId, academicYear },
    {
      student: studentId,
      academicYear,
      grade,
      section,
      semester1Total,
      semester2Total,
      yearTotalRaw,
      yearFinalScore,
    },
    { upsert: true, new: true }
  );

  // 🔹 Recalculate ranking for section
  await recalculateSectionRanking(academicYear, grade, section);
};
