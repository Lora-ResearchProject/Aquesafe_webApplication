import React from "react";
import icon from "../../assets/icons/chat.png";

const Section_01_sm_02 = ({chatCount, loading, error }) => {
  return (
    <div className="rounded-2xl shadow-lg bg-white flex justify-evenly items-center flex-1">
      <div className="flex flex-col justify-evenly items-center">
        <div className="text-2xl font-semibold">Chats</div>
        {loading ? (
          <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mt-1"></div>
        ) : (
          <div className="text-xl">{error ? "0" : chatCount}</div>
        )}
      </div>

      <div className="flex justify-center items-center">
        <img src={icon} alt="Icon" className="w-16 h-16" />
      </div>
    </div>
  );
};

export default Section_01_sm_02;
