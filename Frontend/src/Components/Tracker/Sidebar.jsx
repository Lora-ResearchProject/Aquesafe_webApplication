import React, { useState } from "react";

const Sidebar = ({
  vessels,
  gateways,
  vesselSearchTerm,
  setVesselSearchTerm,
  gatewaySearchTerm,
  setGatewaySearchTerm,
  selectedLocation,
  setSelectedLocation,
}) => {
  const [activeTab, setActiveTab] = useState("vessels"); // State to manage active tab

  return (
    <div className="w-1/4 bg-gray-100 p-4 border-none border-gray-300">
      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`py-2 px-4 ${
            activeTab === "vessels" ? "border-b-2 border-blue-500 font-bold" : ""
          }`}
          onClick={() => setActiveTab("vessels")}
        >
          Vessels
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "gateways" ? "border-b-2 border-blue-500 font-bold" : ""
          }`}
          onClick={() => setActiveTab("gateways")}
        >
          Gateways
        </button>
      </div>

      {/* Search Bar */}
      {activeTab === "vessels" ? (
        <input
          type="text"
          placeholder="Search Vessels..."
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={vesselSearchTerm}
          onChange={(e) => setVesselSearchTerm(e.target.value)}
        />
      ) : (
        <input
          type="text"
          placeholder="Search Gateways..."
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={gatewaySearchTerm}
          onChange={(e) => setGatewaySearchTerm(e.target.value)}
        />
      )}

      {/* Locations List */}
      <div className="space-y-2">
        {activeTab === "vessels"
          ? vessels
              .filter((vessel) =>
                vessel.name.toLowerCase().includes(vesselSearchTerm.toLowerCase())
              )
              .map((vessel) => (
                <div
                  key={vessel.id}
                  onClick={() => setSelectedLocation(vessel)}
                  className={`p-3 rounded-lg cursor-pointer border ${
                    selectedLocation?.id === vessel.id
                      ? "bg-blue-100 border-blue-300"
                      : "bg-white border-gray-300"
                  } hover:bg-blue-50`}
                >
                  <strong className="block text-lg font-medium text-gray-800">
                    {vessel.name}
                  </strong>
                  <p className="text-sm text-gray-600">
                    {vessel.lat.toFixed(3)}N, {vessel.lng.toFixed(3)}W
                  </p>
                </div>
              ))
          : gateways
              .filter((gateway) =>
                gateway.name.toLowerCase().includes(gatewaySearchTerm.toLowerCase())
              )
              .map((gateway) => (
                <div
                  key={gateway.id}
                  onClick={() => setSelectedLocation(gateway)}
                  className={`p-3 rounded-lg cursor-pointer border ${
                    selectedLocation?.id === gateway.id
                      ? "bg-blue-100 border-blue-300"
                      : "bg-white border-gray-300"
                  } hover:bg-blue-50`}
                >
                  <strong className="block text-lg font-medium text-gray-800">
                    {gateway.name}
                  </strong>
                  <p className="text-sm text-gray-600">
                    {gateway.lat.toFixed(3)}N, {gateway.lng.toFixed(3)}W
                  </p>
                </div>
              ))}
      </div>
    </div>
  );
};

export default Sidebar;
