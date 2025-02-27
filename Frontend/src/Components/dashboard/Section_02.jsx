import React from "react";
import { useNavigate } from "react-router-dom";

const Section_02 = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/tracker");
  };

  return (
    <div
      className="rounded-2xl shadow-lg bg-white h-full flex flex-col cursor-pointer border-2 border-transparent hover:border-gray-400 transition-all duration-200"
      onClick={handleRedirect}
    >
      <div className="flex justify-between items-center h-1/6 px-6">
        <div className="text-2xl font-semibold">Vessel Tracker</div>
      </div>
    </div>
  );
};

export default Section_02;
