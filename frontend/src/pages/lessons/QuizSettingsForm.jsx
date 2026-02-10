import api from "../../api/axios";

const QuizSettingsForm = ({ quiz, setQuiz }) => {
  const handleChange = async (field, value) => {
    // ✅ Updated path to include /quizzes/quizzes
    const res = await api.put(`/quizzes/quizzes/${quiz._id}`, {
      [field]: value,
    });
    setQuiz(res.data);
  };

  const togglePublish = async () => {
    // ✅ Updated path to include /quizzes/quizzes
    const res = await api.patch(`/quizzes/quizzes/${quiz._id}/publish`);
    setQuiz({ ...quiz, status: res.data.status });
  };

  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold mb-3">Quiz Settings</h3>

      <input
        value={quiz.title}
        onChange={(e) => handleChange("title", e.target.value)}
        className="w-full border px-3 py-2 mb-3"
        placeholder="Quiz title"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={quiz.randomizeQuestions}
          onChange={(e) =>
            handleChange("randomizeQuestions", e.target.checked)
          }
        />
        Randomize questions
      </label>

      <div className="mt-4 flex gap-3">
        <button
          onClick={togglePublish}
          className={`px-4 py-2 rounded text-white ${
            quiz.status === "published"
              ? "bg-gray-500"
              : "bg-green-600"
          }`}
        >
          {quiz.status === "published" ? "Unpublish" : "Publish"}
        </button>

        <span className="text-sm text-gray-500 self-center">
          Status: {quiz.status}
        </span>
      </div>
    </div>
  );
};

export default QuizSettingsForm;
