import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import QuestionEditor from "./QuestionEditor";

const QuestionList = ({ quiz }) => {
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!quiz?._id) return;

    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/quizzes/${quiz._id}/questions`);
        setQuestions(res.data);
      } catch (err) {
        console.error(
          "Failed to load questions:",
          err.response?.data || err.message
        );
      }
    };

    fetchQuestions();
  }, [quiz?._id]);

  const handleAddQuestion = () => {
    navigate(`/teacher/quizzes/${quiz._id}/questions/new`);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-6">
        Questions ({questions.length})
      </h3>

      <div className="space-y-6">
        {questions.map((q, index) => (
          <div
            key={q._id}
            className="bg-white border rounded-xl p-5 shadow-sm"
          >
            {editingId === q._id ? (
              <QuestionEditor
                question={q}
                onUpdate={(updated) => {
                  setQuestions((prev) =>
                    prev.map((x) =>
                      x._id === updated._id ? updated : x
                    )
                  );
                  setEditingId(null);
                }}
                onDelete={() => {
                  setQuestions((prev) =>
                    prev.filter((x) => x._id !== q._id)
                  );
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold">
                      Question {index + 1}
                    </h4>
                    <div className="flex gap-2 mt-1">
                      <span className="px-2 py-1 bg-gray-100 text-sm rounded">
                        {q.points} pts
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {q.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm">
                    <button
                      onClick={() => setEditingId(q._id)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        setQuestions((prev) =>
                          prev.filter((x) => x._id !== q._id)
                        )
                      }
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <p className="mt-4 text-gray-800 font-medium">
                  {q.text}
                </p>

                {/* Options */}
                <div className="mt-4 space-y-2">
                  {q.options.map((opt, i) => {
                    const isCorrect = q.correctAnswers.includes(i);

                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-2 p-2 rounded ${
                          isCorrect
                            ? "bg-green-50 border border-green-200"
                            : ""
                        }`}
                      >
                        {q.type === "mcq_single" && (
                          <input type="radio" disabled />
                        )}

                        {q.type === "mcq_multi" && (
                          <input type="checkbox" disabled />
                        )}

                        {q.type === "true_false" && (
                          <input type="radio" disabled />
                        )}

                        <span
                          className={
                            isCorrect
                              ? "text-green-700 font-medium"
                              : ""
                          }
                        >
                          {opt.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add Question Button */}
      <button
        onClick={handleAddQuestion}
        className="mt-8 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        + Add Question
      </button>
    </div>
  );
};

export default QuestionList;
