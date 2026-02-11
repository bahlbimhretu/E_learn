import api from "../../api/axios";

const QuizSettingsForm = ({ quiz, setQuiz }) => {
  const handleChange = async (field, value) => {
    try {
      const res = await api.put(`/quizzes/quizzes/${quiz._id}`, {
        [field]: value,
      });
      setQuiz(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async () => {
    try {
      const res = await api.patch(`/quizzes/quizzes/${quiz._id}/publish`);
      setQuiz({ ...quiz, status: res.data.status });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="border rounded p-4 space-y-4">
      <h3 className="font-semibold text-lg">Quiz Settings</h3>

      {/* Title */}
      <input
        value={quiz.title}
        onChange={(e) => handleChange("title", e.target.value)}
        className="w-full border px-3 py-2"
        placeholder="Quiz title"
      />

      {/* Instructions */}
      <textarea
        value={quiz.instructions || ""}
        onChange={(e) => handleChange("instructions", e.target.value)}
        className="w-full border px-3 py-2"
        placeholder="Quiz instructions"
      />

      {/* Time Limit */}
      <input
        type="number"
        value={quiz.timeLimit || ""}
        onChange={(e) => handleChange("timeLimit", e.target.value ? parseInt(e.target.value) : null)}
        className="w-full border px-3 py-2"
        placeholder="Time limit (minutes)"
        min={1}
      />

      {/* Attempts Allowed */}
      <input
        type="number"
        value={quiz.attemptsAllowed || 1}
        onChange={(e) => handleChange("attemptsAllowed", parseInt(e.target.value))}
        className="w-full border px-3 py-2"
        placeholder="Attempts allowed"
        min={1}
      />

      {/* Pass Score */}
      <input
        type="number"
        value={quiz.passScore || ""}
        onChange={(e) => handleChange("passScore", e.target.value ? parseInt(e.target.value) : null)}
        className="w-full border px-3 py-2"
        placeholder="Pass score (optional)"
        min={0}
      />

      {/* Randomize Questions */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={quiz.randomizeQuestions}
          onChange={(e) => handleChange("randomizeQuestions", e.target.checked)}
        />
        Randomize questions
      </label>

      {/* Publish/Unpublish */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePublish}
          className={`px-4 py-2 rounded text-white ${
            quiz.status === "published" ? "bg-gray-500" : "bg-green-600"
          }`}
        >
          {quiz.status === "published" ? "Unpublish" : "Publish"}
        </button>
        <span className="text-sm text-gray-500">Status: {quiz.status}</span>
      </div>
    </div>
  );
};

export default QuizSettingsForm;
