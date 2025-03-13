// Components/Tracker/ZoneList.js
import React from "react";
import ZoneActions from "./ZoneActions";

const ZoneList = ({ zones, searchTerm, onEdit, onDelete }) => {
  return (
    <div className="space-y-2">
      {zones
        .filter((zone) =>
          zone.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((zone) => (
          <div
            key={zone._id}
            className="p-3 rounded-lg bg-white border border-gray-300 hover:bg-blue-50 cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div>
                <strong className="block text-lg font-medium text-gray-800">
                  {zone.name}
                </strong>
                <p className="text-sm text-gray-600">
                  {zone.boundary.length} points
                </p>
              </div>
              <ZoneActions
                zone={zone}
                onEdit={() => onEdit(zone)}
                onDelete={onDelete}
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default ZoneList;
//onClick={() => onZoneClick(zone)}, onZoneClick
