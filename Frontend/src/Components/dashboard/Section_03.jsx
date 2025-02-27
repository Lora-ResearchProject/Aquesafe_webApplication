import React from "react";
import { useNavigate } from "react-router-dom";
import icon from "../../assets/icons/sos.png";
import { parseDateTime } from "../../utils/dateTimeUtils";

const Section_03 = ({ sosData, sosCount, loading, error }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/sos");
  };

  return (
    <div
      className="rounded-2xl shadow-lg bg-white h-full flex flex-col cursor-pointer border-2 border-transparent hover:border-gray-400 transition-all duration-200"
      onClick={handleRedirect}
    >
      {/* Header */}
      <div className="flex justify-between items-center h-1/5 px-6 py-3">
        <div className="flex flex-col justify-evenly items-start">
          <div className="text-2xl font-semibold text-red-500">SOS Alerts</div>

          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mt-1"></div>
          ) : (
            <div className="text-xl">
              {error ? "0" : sosCount}{" "}
              <span className="text-sm text-gray-500">unresolved alerts</span>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center">
          <img src={icon} alt="SOS Icon" className="w-14 h-14" />
        </div>
      </div>

      {/* Alerts List */}
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
        {!loading && !error && sosData.length === 0 && (
          <div className="text-center text-gray-500 h-full flex justify-center items-center">
            No Active SOS Alerts
          </div>
        )}
        {!loading &&
          !error &&
          sosData.map((sos, index) => {
            const { date, time } = parseDateTime(sos.dateTime);

            return (
              <div
                key={index}
                className="bg-white p-1 rounded-lg mb-2 shadow-md flex justify-between items-center border-2 border-red-500"
              >
                {/* Left Side - Vessel ID & Location */}
                <div className="w-3/4 pl-5">
                  <h2 className="font-bold text-lg text-blue-600">
                    {sos.vesselName}
                  </h2>
                  <p>
                    <strong>Location:</strong>{" "}
                    {`${sos.lat.toFixed(3)}N, ${sos.lng.toFixed(3)}W`}
                  </p>
                </div>

                {/* Right Side - Date & Time */}
                <div className="w-1/4 text-left pr-5">
                  <p>
                    <strong>Date:</strong> {date}
                  </p>
                  <p>
                    <strong>Time:</strong> {time}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Section_03;
