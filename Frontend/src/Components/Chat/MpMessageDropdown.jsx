import React from "react";

const MpMessageDropdown = ({
  dropdownOptions,
  selectedMessage,
  setSelectedMessage,
  loading,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select a message:
      </label>
      {loading ? (
        <div className="text-gray-500 text-center py-2">
          Loading messages...
        </div>
      ) : (
        <select
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={selectedMessage ? selectedMessage.messageNumber : ""}
          onChange={(e) => {
            const selectedValue = e.target.value;
            if (selectedValue === "") {
              setSelectedMessage(null); // Clear selection if "Select a message" is chosen
            } else {
              const message = dropdownOptions.find(
                (option) => option.messageNumber === parseInt(selectedValue)
              );
              setSelectedMessage(message);
            }
          }}
        >
          <option value="">Select a message</option>
          {dropdownOptions.map((option) => (
            <option key={option.messageNumber} value={option.messageNumber}>
              {option.message}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default MpMessageDropdown;
