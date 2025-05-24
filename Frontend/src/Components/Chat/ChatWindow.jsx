import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseURL } from "../../config/config";
import { sendMessageToVessel } from "../../services/chatService";
import { usePolling } from "../../contexts/PollingContext";

const ChatWindow = ({ vessel, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const chatContainerRef = useRef(null);
  const { chatUpdateTrigger } = usePolling();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseURL}/api/chat/${vessel.vesselId}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/messageData/`);
      const filteredOptions = response.data.data.filter(
        (option) => option.messageNumber !== 0
      );
      setDropdownOptions(filteredOptions);
    } catch (error) {
      console.error("Failed to fetch dropdown options:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchDropdownOptions();
  }, [vessel]);

  useEffect(() => {
    fetchMessages();
  }, [chatUpdateTrigger]);

  // Handle sending a message
  const handleSend = async () => {
    if (!selectedMessage) {
      alert("Please select a message to send.");
      return;
    }

    try {
      await sendMessageToVessel(
        vessel.vesselId,
        selectedMessage.messageNumber,
        selectedMessage.message
      );

      // setMessages((prev) => [
      //   ...prev,
      //   {
      //     direction: "send",
      //     messageNumber: selectedMessage.messageNumber,
      //     message: selectedMessage.message,
      //     dateTime: new Date().toISOString(),
      //   },
      // ]);
      setSelectedMessage(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groupedMessages = {};
    messages.forEach((msg) => {
      const date = new Date(msg.dateTime).toLocaleDateString();
      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(msg);
    });
    return groupedMessages;
  };

  const groupedMessages = groupMessagesByDate(messages);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full mx-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white rounded-lg">
        <button className="hover:underline focus:outline-none" onClick={onBack}>
          ← Back
        </button>
        <h2 className="text-lg font-bold">{vessel.vesselName}</h2>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-700">Loading messages, please wait...</p>
        </div>
      )}

      {/* Chat Messages */}

      {/* Chat Messages */}
      {!loading && (
        <div
          ref={chatContainerRef} // Attach the ref to the chat container
          className="flex-1 p-4 overflow-y-auto my-1"
        >
          {Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="flex items-center justify-center my-4">
                <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {date}
                </div>
              </div>

              {/* Messages for this date */}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    msg.direction === "send" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.direction === "send"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs text-gray-400 mt-1 text-right">
                      {new Date(msg.dateTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="w-full flex justify-center items-center">
        <div className="p-4 bg-white rounded-xl flex justify-between items-center w-1/2 shadow-md">
          <select
            className="p-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 mr-4 shadow-sm"
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
            className="w-1/6 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
