import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../layout/Layout";

const NewQuestion = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [type, setType] = useState("mcq_single");
  const [text, setText] = useState("");
  const [options, setOptions] = useState([{ text: "" }, { text: "" }]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [points, setPoints] = useState(1);
  const [error, setError] = useState("");

  // Handle adding a new option
  const addOption = () => {
    setOptions([...options, { text: "" }]);
  };

  // Handle option text change
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  // Handle selecting correct answers
  const handleCorrectAnswerChange = (index) => {
    if (type === "mcq_single") {
      setCorrectAnswers([index]);
    } else {
      // multi-select
      if (correctAnswers.includes(index)) {
        setCorrectAnswers(correctAnswers.filter((i) => i !== index));
      } else {
        setCorrectAnswers([...correctAnswers, index]);
      }
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await api.post(`/quizzes/${quizId}/questions`, {
      type,
      text,
      options,
      correctAnswers,
      points: Number(points),
      order: 0,
    });
    navigate(`/teacher/quizzes/${quizId}`); // success
  } catch (err) {
    console.error("Add question failed:", err.response?.status, err.response?.data);
    setError(err.response?.data?.message || "Failed to add question");
  }
};


  return (
    <Layout>
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Add New Question</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Question text */}
        <div>
          <label className="block font-medium">Question Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>

        {/* Question type */}
        <div>
          <label className="block font-medium">Question Type</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setCorrectAnswers([]); // reset correct answers
            }}
            className="w-full border rounded p-2"
          >
            <option value="mcq_single">Multiple Choice (Single Answer)</option>
            <option value="mcq_multi">Multiple Choice (Multiple Answers)</option>
            <option value="true_false">True / False</option>
          </select>
        </div>

        {/* Options (skip for true/false) */}
        {(type === "mcq_single" || type === "mcq_multi") && (
          <div>
            <label className="block font-medium">Options</label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center mb-2">
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className="border rounded p-1 flex-1"
                />
                <input
                  type={type === "mcq_single" ? "radio" : "checkbox"}
                  checked={correctAnswers.includes(idx)}
                  onChange={() => handleCorrectAnswerChange(idx)}
                  className="ml-2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
            >
              + Add Option
            </button>
          </div>
        )}

        {/* True/False handling */}
        {type === "true_false" && (
          <div>
            <label className="block font-medium">Select Correct Answer</label>
            <div className="flex gap-4 mt-2">
              {[true, false].map((val, idx) => (
                <label key={idx} className="flex items-center gap-1">
                  <input
                    type="radio"
                    checked={correctAnswers.includes(idx)}
                    onChange={() => setCorrectAnswers([idx])}
                  />
                  {val ? "True" : "False"}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Points */}
        <div>
          <label className="block font-medium">Points</label>
          <input
            type="number"
            value={points}
            min={1}
            onChange={(e) => setPoints(e.target.value)}
            className="border rounded p-1 w-24"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Add Question
        </button>
      </form>
    </div>
    </Layout>
  );
};

export default NewQuestion;
