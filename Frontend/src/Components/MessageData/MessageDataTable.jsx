import React, { useState } from "react";

const MessageDataTable = ({ messages, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 5;

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);

  const totalPages = Math.ceil(messages.length / messagesPerPage);

  return (
    <div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Number</th>
            <th className="border px-4 py-2">Message</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentMessages.map((msg) => (
            <tr key={msg._id} className="text-center">
              <td className="border px-4 py-2">{msg.messageNumber}</td>
              <td className="border px-4 py-2">{msg.message}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => onEdit(msg)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(msg._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded mx-1"
        >
          Previous
        </button>
        <span className="px-3 py-1">{`${currentPage} / ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded mx-1"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MessageDataTable;
