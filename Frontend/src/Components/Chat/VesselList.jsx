import React from "react";
import icon from "../../assets/icons/chatdp.png";
import MessagePopup from "./MessagePopup";

const VesselList = ({
  vessels,
  latestChats,
  error,
  loading,
  onSelect,
  onNewChatClick,
}) => {
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
      {/* Header with Action */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow-sm transition duration-200"
          onClick={onNewChatClick}
        >
          + New Chat
        </button>
        <MessagePopup />
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex flex-col items-center mt-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-600 text-sm">
            Loading chats, please wait...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md text-center mt-20">
          Failed to load chats. Please try again later.
        </div>
      )}

      {/* No Messages */}
      {!loading && !error && vessels.length === 0 && (
        <div className="text-center mt-20 text-gray-500 text-sm">
          No messages available.
        </div>
      )}

      {/* Chat List */}
      {!loading && !error && vessels.length > 0 && (
        <ul className="space-y-3">
          {[...vesselsWithChats]
            .sort((a, b) => {
              const dateA = new Date(a.latestChat?.dateTime || 0);
              const dateB = new Date(b.latestChat?.dateTime || 0);
              return dateB - dateA; // descending (latest first)
            })
            .map((vessel) => {
              const { date, time } = parseDateTime(vessel.latestChat?.dateTime);
              return (
                <li
                  key={vessel.vesselId}
                  onClick={() => onSelect(vessel)}
                  className="flex items-center bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer px-4 py-3"
                >
                  {/* Profile Image */}
                  <img
                    src={icon}
                    alt="Chat"
                    className="w-12 h-12 rounded-full mr-4 border border-gray-300"
                  />

                  {/* Vessel Info */}
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-semibold text-blue-700 text-base truncate">
                      {vessel.vesselName}
                    </h3>
                    {vessel.hasChat && (
                      <p className="text-gray-600 text-sm truncate">
                        {vessel.latestChat?.message}
                      </p>
                    )}
                  </div>

                  {/* Date & Time */}
                  {vessel.hasChat && (
                    <div className="text-xs text-gray-500 text-right ml-4 whitespace-nowrap">
                      <span>{date}</span>
                      <br />
                      <span>{time}</span>
                    </div>
                  )}
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
};

export default VesselList;
