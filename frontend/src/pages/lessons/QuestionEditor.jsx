import api from "../../api/axios";

const QuestionEditor = ({ question, onUpdate, onDelete }) => {
  const save = async (field, value) => {
    // ✅ Correct path: /api/questions/:id
    const res = await api.put(`/questions/${question._id}`, {
      [field]: value,
    });
    onUpdate(res.data);
  };

  const remove = async () => {
    // ✅ Correct path: /api/questions/:id
    await api.delete(`/questions/${question._id}`);
    onDelete();
  };

  return (
    
    <div className="border p-3 rounded">
      <input
        value={question.text}
        onChange={(e) => save("text", e.target.value)}
        className="w-full border px-2 py-1 mb-2"
      />

      <input
        type="number"
        value={question.points}
        onChange={(e) => save("points", Number(e.target.value))}
        className="w-24 border px-2 py-1 mb-2"
      />

      <button
        onClick={remove}
        className="text-sm text-red-600"
      >
        Delete question
      </button>
    </div>
    
  );
};

export default QuestionEditor;
