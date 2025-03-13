import React from "react";
import icon from "../../assets/icons/chatdp.png";
import MessagePopup from "./MessagePopup";

const VesselList = ({ vessels, latestChats, onSelect, onNewChatClick }) => {
  const vesselsWithChats = vessels.map((vessel) => {
    const hasChat = latestChats.some(
      (chat) => chat.vesselId === vessel.vesselId
    );
    const latestChat = latestChats.find(
      (chat) => chat.vesselId === vessel.vesselId
    );
    return { ...vessel, hasChat, latestChat };
  });

  // Parse date and time from a timestamp
  const parseDateTime = (dateTime) => {
    if (!dateTime) return { date: "", time: "" };
    const dateObj = new Date(dateTime);
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString();
    return { date, time };
  };

  return (
    <div className="max-w-full mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={onNewChatClick}
        >
          New Chat
        </button>
        <MessagePopup />
      </div>
      <ul>
        {vesselsWithChats.map((vessel) => {
          const { date, time } = parseDateTime(vessel.latestChat?.dateTime);
          return (
            <li
              key={vessel.vesselId}
              className="bg-white p-3 rounded-lg mb-2 shadow-md flex justify-between items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelect(vessel)}
            >
              {/* Profile Image */}
              <img
                src={icon}
                alt="Chat"
                className="w-12 h-12 rounded-full mr-4"
              />

              {/* Vessel Details */}
              <div className="flex-1">
                <h2 className="font-semibold text-lg text-blue-600">
                  {vessel.vesselName}
                </h2>
                {vessel.hasChat && (
                  <p className="text-gray-600 text-sm truncate">
                    {vessel.latestChat?.message}
                  </p>
                )}
              </div>

              {/* Date & Time */}
              {vessel.hasChat && (
                <div className="text-xs text-gray-500 text-end">
                  {date} <br />
                  {time}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default VesselList;
