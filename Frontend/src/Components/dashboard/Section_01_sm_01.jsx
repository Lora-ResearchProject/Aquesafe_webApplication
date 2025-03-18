import React from "react";
import icon from "../../assets/icons/fishing_boat.png";
import { useNavigate } from "react-router-dom";

const Section_01_sm_01 = ({ vesselCount, loading, error }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/vessels");
  };
  return (
    <div
      className="rounded-2xl shadow-lg bg-white flex justify-evenly items-center flex-1 cursor-pointer border-2 border-transparent hover:border-gray-400 transition-all duration-200"
      onClick={handleRedirect}
    >
      <div className="flex flex-col justify-evenly items-center">
        <div className="text-2xl font-semibold">Vessels</div>

        {loading ? (
          <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mt-1"></div>
        ) : (
          <div className="text-xl">{error ? "0" : vesselCount}</div>
        )}
      </div>

      <div className="flex justify-center items-center">
        <img src={icon} alt="Icon" className="w-16 h-16" />
      </div>
    </div>
  );
};

export default Section_01_sm_01;
