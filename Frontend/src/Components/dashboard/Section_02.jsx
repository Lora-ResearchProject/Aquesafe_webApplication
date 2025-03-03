import React from "react";
import { useNavigate } from "react-router-dom";
import { parseDateTime } from "../../utils/dateTimeUtils";

const Section_02 = ({ vesselData, vesselCount, loading, error }) => {
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

        {!loading && !error && vesselData.length === 0 && (
          <div className="text-center text-gray-500 h-full flex justify-center items-center">
            No Vessel Data Available
          </div>
        )}

        {!loading &&
          !error &&
          vesselData.map((vessel, index) => {
            const { date, time } = parseDateTime(vessel.dateTime);

            return (
              <div
                key={index}
                className="bg-white p-2 rounded-lg mb-2 shadow-md flex justify-between items-center"
              >
                {/* Vessel Details */}
                <div>
                  <h2 className="font-semibold text-lg">{vessel.vesselName}</h2>
                  <p className="text-gray-600 text-sm">
                    {vessel.lat.toFixed(3)}N, {vessel.lng.toFixed(3)}W
                  </p>
                </div>

                {/* Last Updated */}
                <div className="text-xs text-gray-500 text-end">
                  <p>Last Updated</p>
                  <p>
                    {date} {time}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Section_02;
