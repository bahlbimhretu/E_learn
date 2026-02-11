import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

const StudentExerciseQuiz = () => {
  const { id } = useParams(); // ✅ quizId from URL

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const res = await api.get(`/api/quizzes/${id}/exercise`);
      setQuiz(res.data.quiz);
      setQuestions(res.data.questions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (questionId, optionIndex, multi) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);

      if (!existing) {
        return [...prev, { questionId, selectedAnswers: [optionIndex] }];
      }

      if (multi) {
        const updated = existing.selectedAnswers.includes(optionIndex)
          ? existing.selectedAnswers.filter((i) => i !== optionIndex)
          : [...existing.selectedAnswers, optionIndex];

        return prev.map((a) =>
          a.questionId === questionId
            ? { ...a, selectedAnswers: updated }
            : a
        );
      }

      return prev.map((a) =>
        a.questionId === questionId
          ? { ...a, selectedAnswers: [optionIndex] }
          : a
      );
    });
  };

  const submitQuiz = async () => {
    try {
      const res = await api.post(
        `/api/quizzes/${id}/exercise/submit`,
        { answers }
      );
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const resetQuiz = () => {
    setAnswers([]);
    setResult(null);
  };

  if (loading) return <p>Loading...</p>;
  if (!quiz) return <p>Quiz not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>
      <p className="mb-6 text-gray-600">{quiz.instructions}</p>

      {questions.map((q) => {
        const questionResult =
          result?.results.find((r) => r.questionId === q._id);

        return (
          <div key={q._id} className="mb-6">
            <p className="font-medium mb-2">{q.text}</p>

            {q.options.map((opt, index) => {
              const isCorrectAnswer =
                questionResult?.correctAnswers.includes(index);

              const isSelected =
                questionResult?.studentAnswers.includes(index);

              return (
                <div
                  key={index}
                  className="p-2 rounded mb-1"
                  style={{
                    backgroundColor: result
                      ? isCorrectAnswer
                        ? "#d4edda"
                        : isSelected
                        ? "#f8d7da"
                        : "transparent"
                      : "transparent",
                  }}
                >
                  <input
                    type={q.type === "mcq_multi" ? "checkbox" : "radio"}
                    name={q._id}
                    disabled={!!result}
                    onChange={() =>
                      handleSelect(
                        q._id,
                        index,
                        q.type === "mcq_multi"
                      )
                    }
                  />
                  <span className="ml-2">{opt.text}</span>
                </div>
              );
            })}
          </div>
        );
      })}

      {!result ? (
        <button
          onClick={submitQuiz}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Check Answers
        </button>
      ) : (
        <div className="mt-6">
          <h3 className="font-bold">
            Score: {result.score} / {result.totalPoints}
          </h3>
          <button
            onClick={resetQuiz}
            className="mt-3 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentExerciseQuiz;
