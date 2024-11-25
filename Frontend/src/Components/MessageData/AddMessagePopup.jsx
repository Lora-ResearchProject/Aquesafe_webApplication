import React, { useState, useEffect } from "react";

const AddMessagePopup = ({ onAddMessage, editMessage, setEditMessage, onClose }) => {
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editMessage) {
      setNumber(editMessage.messageNumber);
      setMessage(editMessage.message);
    }
  }, [editMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (number && parseInt(number) >= 0 && message) {
      onAddMessage({ messageNumber: parseInt(number), message });
      setNumber("");
      setMessage("");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">
          {editMessage ? "Edit Message" : "Add New Message"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Number</label>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full p-2 border rounded"
              required
              min="0"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
              Close
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              {editMessage ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMessagePopup;
