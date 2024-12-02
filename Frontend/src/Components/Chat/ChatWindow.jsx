import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatWindow = ({ vessel, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/chat/${vessel.vesselId}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    const fetchDropdownOptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/messageData/"
        );
        setDropdownOptions(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dropdown options:", error);
      }
    };

    fetchMessages();
    fetchDropdownOptions();
  }, [vessel]);

  const handleSend = async () => {
    if (!selectedMessage) {
      alert("Please select a message to send.");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/chat/", {
        vesselId: vessel.vesselId,
        messageNumber: selectedMessage.messageNumber,
        message: selectedMessage.message,
      });

      setMessages((prev) => [
        ...prev,
        {
          direction: "send",
          messageNumber: selectedMessage.messageNumber,
          message: selectedMessage.message,
        },
      ]);
      setSelectedMessage(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="h-full mx-auto bg-white shadow-lg rounded-lg flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-gray-200">
        <button className="text-blue-500 hover:underline" onClick={onBack}>
          Back
        </button>
        <h2 className="text-lg font-bold">{vessel.vesselName}</h2>
      </div>
      {/* Chat Messages */}
      <div
        className="flex-1 p-4 overflow-y-auto"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 max-w-xs rounded ${
              msg.direction === "send"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>
      {/* Input Area */}
      <div className="p-4 border-t bg-gray-100">
        <select
          className="w-full p-2 border rounded mb-2"
          value={selectedMessage ? selectedMessage.messageNumber : ""}
          onChange={(e) =>
            setSelectedMessage(
              dropdownOptions.find(
                (option) => option.messageNumber === parseInt(e.target.value)
              )
            )
          }
        >
          <option value="">Select a message</option>
          {dropdownOptions.map((option) => (
            <option key={option.messageNumber} value={option.messageNumber}>
              {option.message}
            </option>
          ))}
        </select>
        <button
          className="w-full bg-blue-500 text-white p-2 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
