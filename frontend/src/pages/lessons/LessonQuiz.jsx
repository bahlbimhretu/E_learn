import { useEffect, useState } from "react";
import api from "../../api/axios";
import QuizSettingsForm from "./QuizSettingsForm";
import QuestionList from "./QuestionList";

const LessonQuiz = ({ lessonId }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        // ✅ Updated path to include /quizzes
        const res = await api.get(`/quizzes/lessons/${lessonId}/quiz`);
        setQuiz(res.data);
      } catch (err) {
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [lessonId]);

  const createQuiz = async () => {
    // ✅ Updated path to include /quizzes
    const res = await api.post(`/quizzes/lessons/${lessonId}/quiz`, {});
    setQuiz(res.data);
  };

  if (loading) return <p>Loading quiz...</p>;

  if (!quiz) {
    return (
      <div className="mt-6">
        <h3 className="font-semibold text-lg">Quiz</h3>
        <button
          onClick={createQuiz}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Create Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <QuizSettingsForm quiz={quiz} setQuiz={setQuiz} />
      <QuestionList quiz={quiz} />
    </div>
  );
};

export default LessonQuiz;
