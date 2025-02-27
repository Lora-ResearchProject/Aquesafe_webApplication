import React from "react";
import { useNavigate } from "react-router-dom";
import icon from "../../assets/icons/chatdp.png";
import { parseDateTime } from "../../utils/dateTimeUtils";

const Section_04 = ({ chatData, chatCount, loading, error }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/chat");
  };
  return (
    <div
      className="rounded-2xl shadow-lg bg-white h-full flex flex-col cursor-pointer border-2 border-transparent hover:border-gray-400 transition-all duration-200"
      onClick={handleRedirect}
    >
      {/* Header */}
      <div className="flex justify-between items-center h-1/6 px-6">
        <div className="text-2xl font-semibold">Latest Chats</div>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto rounded-2xl">
        {loading && (
          <div className="text-center text-lg text-gray-500 h-full flex justify-center items-center">
            <div className="animate-spin h-10 w-10 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-lg text-red-500 h-full flex justify-center items-center">
            {error}
          </div>
        )}

        {!loading && !error && chatData.length === 0 && (
          <div className="text-center text-gray-500 h-full flex justify-center items-center">
            No Chats Available
          </div>
        )}

        {!loading &&
          !error &&
          chatData.map((chat, index) => {
            const { date, time } = parseDateTime(chat.dateTime);
            return (
              <div
                key={index}
                className="bg-white p-2 rounded-lg mb-2 shadow-md flex justify-between items-center"
              >
                {/* Profile Image */}
                <img
                  src={icon}
                  alt="Chat"
                  className="w-12 h-12 rounded-full mr-4"
                />

                {/* Chat Details */}
                <div className="flex-1">
                  <h2 className="font-semibold text-lg text-blue-600">
                    {chat.vesselName}
                  </h2>
                  <p className="text-gray-600 text-sm truncate">
                    {chat.message}
                  </p>
                </div>

                {/* Date & Time */}
                <div className="text-xs text-gray-500 text-end">
                  {date} <br />
                  {time}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Section_04;
