import React, { useState } from "react";
import RefreshTimer from "./RefreshTimer";
import RefreshButton from "./RefreshButton";
import ZoneCreater from "./ZoneCreater";
import ZoneSearch from "./ZoneSearch";
import ZoneList from "./ZoneList";
import { deleteZone } from "../../services/zoneService";

const Sidebar = ({
  vessels,
  gateways,
  vesselSearchTerm,
  setVesselSearchTerm,
  gatewaySearchTerm,
  setGatewaySearchTerm,
  selectedLocation,
  setSelectedLocation,
  refreshVessels,
  lastRefreshTime,
  refreshTrigger,
  onZoneCreated,
  zones,
  hotspots,
}) => {
  const [activeTab, setActiveTab] = useState("vessels");
  const [zoneSearchTerm, setZoneSearchTerm] = useState("");
  const [hotspotSearchTerm, setHotspotSearchTerm] = useState("");

  // Handle deleting a zone
  const handleDeleteZone = async (zoneId) => {
    try {
      await deleteZone(zoneId);
      onZoneCreated(); // Refresh the zones list
    } catch (error) {
      console.error("Failed to delete zone:", error);
    }
  };

  // Handle editing a zone
  const handleEditZone = async () => {
    onZoneCreated(); // Refresh the zones list after editing
  };

  return (
    <div className="w-1/4 bg-gray-100 p-4 border-none border-gray-300">
      <div className="flex space-x-1 mb-4">
        <button
          className={`py-2 px-2 ${
            activeTab === "vessels"
              ? "border-b-2 border-blue-600 font-bold"
              : ""
          }`}
          onClick={() => setActiveTab("vessels")}
        >
          Vessels
        </button>
        <button
          className={`py-2 px-2 ${
            activeTab === "gateways"
              ? "border-b-2 border-blue-600 font-bold"
              : ""
          }`}
          onClick={() => setActiveTab("gateways")}
        >
          Gateways
        </button>
        <button
          className={`py-2 px-2 ${
            activeTab === "zones" ? "border-b-2 border-blue-600 font-bold" : ""
          }`}
          onClick={() => setActiveTab("zones")}
        >
          Zones
        </button>
        <button
          className={`py-2 px-2 ${
            activeTab === "hotspots"
              ? "border-b-2 border-blue-600 font-bold"
              : ""
          }`}
          onClick={() => setActiveTab("hotspots")}
        >
          Hotspots
        </button>
      </div>

      {activeTab === "zones" ? (
        <>
          {/* Zone Search */}
          <ZoneSearch
            searchTerm={zoneSearchTerm}
            setSearchTerm={setZoneSearchTerm}
          />

          {/* Zone Creation Button */}
          <div className="mb-4 px-2 flex items-center justify-end">
            <ZoneCreater onZoneCreated={onZoneCreated} />
          </div>

          {/* Zone List */}
          <ZoneList
            zones={zones}
            searchTerm={zoneSearchTerm}
            onEdit={handleEditZone} // Pass the edit handler
            onDelete={handleDeleteZone} // Pass the delete handler
          />
        </>
      ) : activeTab === "hotspots" ? (
        <>
          {/* Hotspot Search */}
          <input
            type="text"
            placeholder="Search Hotspots..."
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={hotspotSearchTerm}
            onChange={(e) => setHotspotSearchTerm(e.target.value)}
          />

          {/* Hotspot List */}
          <div className="space-y-2">
            {hotspots
              .filter((hotspot) =>
                hotspot.hotspotId
                  .toString()
                  .toLowerCase()
                  .includes(hotspotSearchTerm.toLowerCase())
              )
              .map((hotspot) => (
                <div
                  key={hotspot.hotspotId}
                  onClick={() =>
                    setSelectedLocation({
                      lat: hotspot.latitude,
                      lng: hotspot.longitude,
                    })
                  }
                  className={`p-3 rounded-lg cursor-pointer border ${
                    selectedLocation?.lat === hotspot.latitude &&
                    selectedLocation?.lng === hotspot.longitude
                      ? "bg-green-100 border-green-300"
                      : "bg-white border-gray-300"
                  } hover:bg-green-50`}
                >
                  <strong className="block text-lg font-medium text-gray-800">
                    Hotspot ID: {hotspot.hotspotId}
                  </strong>
                  <p className="text-sm text-gray-600">
                    Vessels: {hotspot.vesselCount}
                  </p>
                  <p className="text-sm text-gray-600">
                    Available Slots: {hotspot.availableSlots}
                  </p>
                  <p className="text-sm text-gray-600">
                    Last Updated:{" "}
                    {new Date(hotspot.currentDateTime).toLocaleString()}
                  </p>
                </div>
              ))}
          </div>
        </>
      ) : (
        <>
          {/* Search Input for Vessels or Gateways */}
          <input
            type="text"
            placeholder={
              activeTab === "vessels"
                ? "Search Vessels..."
                : "Search Gateways..."
            }
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={
              activeTab === "vessels" ? vesselSearchTerm : gatewaySearchTerm
            }
            onChange={(e) =>
              activeTab === "vessels"
                ? setVesselSearchTerm(e.target.value)
                : setGatewaySearchTerm(e.target.value)
            }
          />

          {/* Refresh Timer and Button for Vessels */}
          {activeTab === "vessels" && (
            <div className="mb-4 px-2 flex items-center justify-between">
              <RefreshTimer
                refreshInterval={60000}
                lastRefreshed={lastRefreshTime}
                refreshTrigger={refreshTrigger}
              />
              <RefreshButton onRefresh={refreshVessels} />
            </div>
          )}

          {/* List of Vessels or Gateways */}
          <div className="space-y-2">
            {(activeTab === "vessels" ? vessels : gateways)
              .filter((item) =>
                item.name
                  .toLowerCase()
                  .includes(
                    (activeTab === "vessels"
                      ? vesselSearchTerm
                      : gatewaySearchTerm
                    ).toLowerCase()
                  )
              )
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedLocation(item)}
                  className={`p-3 rounded-lg cursor-pointer border ${
                    selectedLocation?.id === item.id
                      ? "bg-blue-100 border-blue-300"
                      : "bg-white border-gray-300"
                  } hover:bg-blue-50`}
                >
                  <strong className="block text-lg font-medium text-gray-800">
                    {item.name}
                  </strong>
                  <p className="text-sm text-gray-600">
                    {item.lat.toFixed(3)}N, {item.lng.toFixed(3)}W
                  </p>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
