import React, { useEffect, useState } from "react";
import {
  fetchMessages,
  addMessage,
  deleteMessage,
  updateMessage,
} from "../services/messageDataService";
import MessageDataTable from "../Components/MessageData/MessageDataTable";
import AddMessagePopup from "../Components/MessageData/AddMessagePopup";

const MessageDataPage = () => {
  const [messages, setMessages] = useState([]);
  const [editMessage, setEditMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const data = await fetchMessages();
        setMessages(data);
      } catch (error) {
        alert("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, []);

  const handleAddMessage = async (newMessage) => {
    try {
      if (editMessage) {
        const updated = await updateMessage(editMessage._id, newMessage);
        setMessages((prev) =>
          prev.map((msg) => (msg._id === updated._id ? updated : msg))
        );
        setEditMessage(null);
        alert("Message updated successfully");
      } else {
        const createdMessage = await addMessage(newMessage);
        setMessages((prev) => [...prev, createdMessage]);
        alert("Message added successfully");
      }
      setShowPopup(false);
    } catch (error) {
      alert("Failed to save message");
    }
  };

  const handleEditMessage = (message) => {
    setEditMessage(message);
    setShowPopup(true);
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteMessage(id);
        setMessages((prev) => prev.filter((message) => message._id !== id));
        alert("Message deleted successfully");
      } catch (error) {
        alert("Failed to delete message");
      }
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.messageNumber.toString().includes(search) ||
      msg.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">Message Database</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by number or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-full md:w-1/3 shadow"
        />
        <button
          onClick={() => setShowPopup(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto"
        >
          Add New Message
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <MessageDataTable
          messages={filteredMessages}
          onEdit={handleEditMessage}
          onDelete={handleDeleteMessage}
        />
      )}
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
