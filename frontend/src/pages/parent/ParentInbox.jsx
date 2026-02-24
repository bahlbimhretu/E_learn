import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import api from "../../api/axios";

const ParentInbox = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Load children
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const { data } = await api.get("/parent/children");
        setChildren(data);

        if (data.length > 0) {
          setSelectedChild(data[0]);
        }
      } catch (err) {
        console.error("Error fetching children", err);
      }
    };

    fetchChildren();
  }, []);

  // 🔹 Load conversation when child changes
  useEffect(() => {
    if (!selectedChild) return;

    const fetchConversation = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(
          `/homeroom/messages/${selectedChild._id}`
        );
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [selectedChild]);

  // 🔹 Send message
  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const { data } = await api.post(
        `/homeroom/messages/${selectedChild._id}`,
        { content: text }
      );

      setMessages((prev) => [...prev, data]);
      setText("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Inbox</h2>
        </div>

        {/* Child Selector */}
        {children.length > 0 && (
          <div className="mb-6">
            <label className="text-sm text-gray-600 mr-3">
              Select Child:
            </label>
            <select
              value={selectedChild?._id}
              onChange={(e) =>
                setSelectedChild(
                  children.find(
                    (child) => child._id === e.target.value
                  )
                )
              }
              className="border rounded px-3 py-2 text-sm bg-white"
            >
              {children.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.name} (Grade {child.studentProfile?.grade} - {child.studentProfile?.section})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Chat Area */}
        <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col h-[500px]">

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No messages yet.
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`p-3 rounded-lg max-w-xs ${
                        msg.senderRole === "parent"
                          ? "bg-blue-200 ml-auto"
                          : "bg-gray-200"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              {selectedChild && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 border rounded-lg p-2"
                  />
                  <button
                    onClick={handleSend}
                    className="bg-blue-600 text-white px-4 rounded-lg"
                  >
                    Send
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ParentInbox;