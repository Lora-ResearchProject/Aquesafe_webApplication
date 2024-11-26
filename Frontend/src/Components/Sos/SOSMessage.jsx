import React from "react";
import activeImage from "../../assets/sos/sos_image.png";
import resolvedImage from "../../assets/sos/resolved_image.png";
import { parseDateTime } from "../../utils/dateTimeUtils";

const getImageByStatus = (sosStatus) => {
  return sosStatus === "active" ? activeImage : resolvedImage;
};

const SOSMessage = ({ sos, onClick }) => {
  const { date, time } = parseDateTime(sos.dateTime);

  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-lg cursor-pointer ${
        sos.sosStatus === "active" ? "border-red-500" : "border-green-500"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="w-5/6 pl-5">
          <h2 className="font-bold text-lg">{sos.vesselId}</h2>
          <p>
            <strong>Location:</strong>{" "}
            {`${sos.lat.toFixed(3)}N, ${sos.lng.toFixed(3)}W`}
          </p>
          <p>
            <strong>Date:</strong> {date} <strong>Time:</strong> {time}
          </p>
        </div>
        <div className="text-center w-1/6">
          <img
            src={getImageByStatus(sos.sosStatus)}
            alt={sos.sosStatus}
            className="w-10 h-10 mx-auto"
          />
          <p
            className={`mt-2 font-semibold ${
              sos.sosStatus === "active" ? "text-red-500" : "text-green-500"
            }`}
          >
            {sos.sosStatus === "active" ? "Active" : "Resolved"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SOSMessage;
