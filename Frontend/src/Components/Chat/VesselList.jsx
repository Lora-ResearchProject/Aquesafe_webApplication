import React from "react";

const VesselList = ({ vessels, onSelect }) => {
  return (
    <div className="max-w-full mx-auto bg-white shadow-lg rounded-lg p-4">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Vessels</h1>
      <ul>
        {vessels.map((vessel) => (
          <li
            key={vessel.vesselId}
            className="p-3 border-b hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelect(vessel)}
          >
            {vessel.vesselName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VesselList;
