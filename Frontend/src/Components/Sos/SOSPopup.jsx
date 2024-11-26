import React from "react";
import MapContainer from "../Map/MapContainer";
import activeImage from "../../assets/sos/sos_image.png";
import resolvedImage from "../../assets/sos/resolved_image.png";
import { parseDateTime } from "../../utils/dateTimeUtils";
import SosMapContainer from "./SosMapContainer";

const getImageByStatus = (sosStatus) => {
  return sosStatus === "active" ? activeImage : resolvedImage;
};

const SOSPopup = ({ sos, onClose, onStatusChange }) => {
  const handleStatusChange = () => {
    if (window.confirm("Are you sure you want to mark this SOS as resolved?")) {
      onStatusChange(sos._id);
    }
  };

  const { date, time } = parseDateTime(sos.dateTime);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className={`bg-white rounded-lg border ${
          sos.sosStatus === "active" ? "border-red-500" : "border-green-500"
        } max-w-xl w-full p-6`}
      >
        <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold mb-4">{sos.vesselId}</h2>
        <img
          src={getImageByStatus(sos.sosStatus)}
          alt={sos.sosStatus}
          className="w-10 h-10 mb-4"
        />
        </div>
        <p>
          <strong>Location:</strong>{" "}
          {`${sos.lat.toFixed(3)}N, ${sos.lng.toFixed(3)}W`}
        </p>
        <p>
          <strong>Date:</strong> {date} <strong>Time:</strong> {time}
        </p>
        <div className="mt-4 h-64">
          <SosMapContainer sosdata={sos} />
        </div>
        <div className="mt-4 flex justify-between">
          {sos.sosStatus === "active" ? (
            <button
              onClick={handleStatusChange}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Mark as Resolved
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-300 text-gray-600 py-2 px-4 rounded cursor-not-allowed"
            >
              Resolved
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-600 py-2 px-4 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SOSPopup;
