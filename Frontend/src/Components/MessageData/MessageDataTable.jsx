import React, { useState } from "react";

const MessageDataTable = ({ messages, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );

  const totalPages = Math.ceil(messages.length / messagesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-8">
      <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
        <thead className="bg-slate-300 text-xs uppercase tracking-wider text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left">Number</th>
            <th className="px-4 py-3 text-left">Message</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {currentMessages.map((msg) => (
            <tr
              key={msg._id}
              className="hover:bg-gray-50 transition duration-150 ease-in-out"
            >
              <td className="px-4 py-3 text-left font-medium text-gray-800">
                {msg.messageNumber}
              </td>
              <td className="px-4 py-3">{msg.message}</td>
              <td className="px-4 py-3 text-center space-x-2">
                <button
                  onClick={() => onEdit(msg)}
                  className="inline-block bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(msg._id)}
                  className="inline-block bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center my-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded text-sm border ${
              currentPage === page
                ? "bg-blue-500 text-white font-semibold"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MessageDataTable;
