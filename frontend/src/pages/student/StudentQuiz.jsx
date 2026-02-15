import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

const StudentExerciseQuiz = () => {
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const res = await api.get(
        `/student/quizzes/${quizId}/exercise`
      );

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

  const getSelectedAnswers = (questionId) => {
    return (
      answers.find((a) => a.questionId === questionId)
        ?.selectedAnswers || []
    );
  };

  const isAnswered = (questionId) => {
    return answers.some((a) => a.questionId === questionId);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const submitQuiz = async () => {
    try {
      const res = await api.post(
        `/student/quizzes/${quizId}/exercise/submit`,
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
    setCurrentIndex(0);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!quiz) return <p className="text-center mt-10">Quiz not found.</p>;

  const q = questions[currentIndex];
  const questionResult =
    result?.results.find((r) => r.questionId === q._id);

  const progressPercentage =
    ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-6xl mx-auto mt-10 flex gap-8 px-4">
      
      {/* LEFT SIDE — QUESTION AREA */}
      <div className="flex-1 bg-white p-6 shadow-xl rounded-xl">
        <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
        <p className="text-gray-600 mb-4">{quiz.instructions}</p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Question {currentIndex + 1} of {questions.length}
        </p>

        {/* Question Card */}
        <div className="border rounded-lg p-6 mb-6">
          <p className="text-lg font-semibold mb-4">{q.text}</p>

          {q.options.map((opt, index) => {
            const isCorrectAnswer =
              questionResult?.correctAnswers.includes(index);

            const isSelected =
              questionResult?.studentAnswers.includes(index);

            return (
              <div
                key={index}
                onClick={() =>
                  !result &&
                  handleSelect(
                    q._id,
                    index,
                    q.type === "mcq_multi"
                  )
                }
                className={`p-3 rounded mb-2 border cursor-pointer transition-all ${
                  result
                    ? isCorrectAnswer
                      ? "bg-green-100 border-green-400"
                      : isSelected
                      ? "bg-red-100 border-red-400"
                      : ""
                    : "hover:bg-gray-100"
                }`}
              >
                <input
                  type={
                    q.type === "mcq_multi"
                      ? "checkbox"
                      : "radio"
                  }
                  name={q._id}
                  checked={getSelectedAnswers(q._id).includes(index)}
                  readOnly
                  className="mr-2"
                />
                {opt.text}
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={nextQuestion}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Next
            </button>
          ) : !result ? (
            <button
              onClick={submitQuiz}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Submit Quiz
            </button>
          ) : (
            <div className="text-right">
              <h3 className="font-bold text-lg">
                Score: {result.score} / {result.totalPoints}
              </h3>
              <button
                onClick={resetQuiz}
                className="mt-2 px-4 py-2 bg-gray-500 text-white rounded"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE — QUESTION NAVIGATOR */}
      <div className="w-64 bg-white p-4 shadow-lg rounded-xl h-fit sticky top-10">
        <h3 className="font-bold mb-4">Questions</h3>

        <div className="grid grid-cols-5 gap-2">
          {questions.map((question, index) => {
            const answered = isAnswered(question._id);

            return (
              <button
                key={question._id}
                onClick={() => setCurrentIndex(index)}
                className={`h-10 rounded font-semibold transition-all ${
                  index === currentIndex
                    ? "bg-blue-600 text-white"
                    : result
                    ? "bg-gray-300"
                    : answered
                    ? "bg-blue-200"
                    : "bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentExerciseQuiz;
