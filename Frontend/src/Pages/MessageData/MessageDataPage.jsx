import React, { useEffect, useState } from "react";
import {
  fetchMessages,
  addMessage,
  deleteMessage,
  updateMessage,
} from "../../services/messageDataService";
import MessageDataTable from "../../Components/MessageData/MessageDataTable";
import AddMessagePopup from "../../Components/MessageData/AddMessagePopup";

const MessageDataPage = () => {
  const [messages, setMessages] = useState([]);
  const [editMessage, setEditMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      const data = await fetchMessages();
      setMessages(data);
    };
    loadMessages();
  }, []);

  const handleAddMessage = async (newMessage) => {
    if (editMessage) {
      const updated = await updateMessage(editMessage._id, newMessage);
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updated._id ? updated : msg))
      );
      setEditMessage(null);
    } else {
      const createdMessage = await addMessage(newMessage);
      setMessages((prev) => [...prev, createdMessage]);
    }
    setShowPopup(false); // Close the popup after adding/editing
  };

  const handleEditMessage = (message) => {
    setEditMessage(message);
    setShowPopup(true); // Open popup for editing
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((message) => message._id !== id));
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.messageNumber.toString().includes(search) ||
      msg.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Message Database</h1>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={() => setShowPopup(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add New Message
        </button>
      </div>
      <MessageDataTable
        messages={filteredMessages}
        onEdit={handleEditMessage}
        onDelete={handleDeleteMessage}
      />
      {showPopup && (
        <AddMessagePopup
          onAddMessage={handleAddMessage}
          editMessage={editMessage}
          setEditMessage={setEditMessage}
          onClose={() => {
            setEditMessage(null);
            setShowPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default MessageDataPage;
