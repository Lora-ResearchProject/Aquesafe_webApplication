import React from "react";
import ZoneActions from "./ZoneActions";
import { getUserRole } from "../../utils/auth";

const ZoneList = ({ zones, searchTerm, onEdit, onDelete }) => {
  const userRole = getUserRole();
  // Filter and sort zones into normal and danger categories
  const normalZones = zones.filter(
    (zone) =>
      zone.zoneType === "normal" &&
      zone.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dangerZones = zones.filter(
    (zone) =>
      zone.zoneType === "danger" &&
      zone.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Normal Zones */}
      {normalZones.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Normal Zones
          </h3>
          {normalZones.map((zone) => (
            <div
              key={zone._id}
              className="p-3 rounded-lg bg-white border border-gray-300 hover:bg-blue-50 cursor-pointer mt-2"
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
                {userRole === "admin" && (
                  <ZoneActions
                    zone={zone}
                    onEdit={() => onEdit(zone)}
                    onDelete={onDelete}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Danger Zones */}
      {dangerZones.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Danger Zones
          </h3>
          {dangerZones.map((zone) => (
            <div
              key={zone._id}
              className="p-3 rounded-lg bg-red-100 border border-red-400 hover:bg-red-200 cursor-pointer mb-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <strong className="block text-lg font-medium text-red-800">
                    {zone.name}
                  </strong>
                  <p className="text-sm text-red-700">
                    {zone.boundary.length} points
                  </p>
                </div>
                {userRole === "admin" && (
                  <ZoneActions
                    zone={zone}
                    onEdit={() => onEdit(zone)}
                    onDelete={onDelete}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ZoneList;
