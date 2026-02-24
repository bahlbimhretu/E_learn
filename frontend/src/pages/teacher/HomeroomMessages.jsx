import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../layout/Layout";

const HomeroomMessages = () => {
  const { classId } = useParams();

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Load students
  useEffect(() => {
    const fetchClass = async () => {
      try {
        const { data } = await api.get(`/classrooms/${classId}`);
        setStudents(data.students);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [classId]);

  // ✅ Load conversation
  const loadConversation = async (studentId) => {
    try {
      const { data } = await api.get(
        `/homeroom/messages/${studentId}`
      );
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Send message
  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const { data } = await api.post(
        `/homeroom/messages/${selectedStudent._id}`,
        { content: text }
      );

      setMessages((prev) => [...prev, data]);
      setText("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">
          Parent Messaging
        </h2>

        <div className="grid grid-cols-12 gap-6">

          {/* LEFT PANEL - Students */}
          <div className="col-span-4 bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-4">Students</h3>

            {loading ? (
              <p>Loading...</p>
            ) : (
              students.map((student) => (
                <div
                  key={student._id}
                  onClick={() => {
                    setSelectedStudent(student);
                    loadConversation(student._id);
                  }}
                  className={`p-3 rounded-lg cursor-pointer mb-2 ${
                    selectedStudent?._id === student._id
                      ? "bg-yellow-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {student.name}
                </div>
              ))
            )}
          </div>

          {/* RIGHT PANEL - Chat */}
          <div className="col-span-8 bg-white rounded-xl shadow p-4 flex flex-col">

            {selectedStudent ? (
              <>
                <h3 className="font-semibold mb-4">
                  Chat with Parent
                </h3>

                <div className="flex-1 overflow-y-auto mb-4">
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`p-3 rounded-lg mb-2 max-w-xs ${
                        msg.senderRole === "teacher"
                          ? "bg-yellow-200 ml-auto"
                          : "bg-gray-200"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 border rounded-lg p-2"
                    placeholder="Type message..."
                  />
                  <button
                    onClick={handleSend}
                    className="bg-yellow-600 text-white px-4 rounded-lg"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a student to start messaging
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomeroomMessages;