import React, { useState, useEffect } from "react";

const AddMessagePopup = ({
  onAddMessage,
  editMessage,
  setEditMessage,
  onClose,
}) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editMessage) {
      setMessage(editMessage.message);
    }
  }, [editMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message) {
      onAddMessage({ message });
      setMessage("");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {editMessage ? "Edit Message" : "Add New Message"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded"
              required
              rows="4"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              {editMessage ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMessagePopup;
