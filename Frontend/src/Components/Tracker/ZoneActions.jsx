import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import ZoneEditor from "./ZoneEditor";

const ZoneActions = ({ zone, onEdit, onDelete }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    onDelete(zone._id);
    setShowConfirmation(false);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleEditClick = () => {
    setShowEditor(true);
  };

  const handleZoneUpdated = () => {
    setShowEditor(false);
    onEdit(); // Notify parent component
  };

  return (
    <div className="flex space-x-2">
      <button
        className="text-blue-500 hover:text-blue-700"
        onClick={handleEditClick}
      >
        <FaEdit />
      </button>
      <button
        className="text-red-500 hover:text-red-700"
        onClick={handleDeleteClick}
      >
        <FaTrash />
      </button>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">Are you sure you want to delete this zone?</p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditor && (
        <ZoneEditor
          zone={zone}
          onZoneUpdated={handleZoneUpdated}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};

export default ZoneActions;
