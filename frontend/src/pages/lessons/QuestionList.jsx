import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import QuestionEditor from "./QuestionEditor";

const QuestionList = ({ quiz }) => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Load quiz questions
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/quizzes/${quiz._id}/questions`);
        setQuestions(res.data);
      } catch (err) {
        console.error("Failed to load questions:", err.response?.data || err.message);
      }
    };
    fetchQuestions();
  }, [quiz._id]);

  const handleAddQuestion = () => {
    // Redirect to the Add Question page for this quiz
    navigate(`/teacher/quizzes/${quiz._id}/questions/new`);
  };

  return (
    <div>
      <h3 className="font-semibold mb-3">
        Questions ({questions.length})
      </h3>

      <div className="space-y-4">
        {questions.map((q) => (
          <QuestionEditor
            key={q._id}
            question={q}
            onUpdate={(updated) =>
              setQuestions((prev) =>
                prev.map((x) => (x._id === updated._id ? updated : x))
              )
            }
            onDelete={() =>
              setQuestions((prev) => prev.filter((x) => x._id !== q._id))
            }
          />
        ))}
      </div>

      <button
        onClick={handleAddQuestion}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        + Add Question
      </button>
    </div>
  );
};

export default QuestionList;
