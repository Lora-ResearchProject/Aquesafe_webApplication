import React, { useState } from "react";
import RefreshTimer from "./RefreshTimer";
import RefreshButton from "./RefreshButton";
import ZoneCreater from "./ZoneCreater";
import ZoneSearch from "./ZoneSearch";
import ZoneList from "./ZoneList";
import { deleteZone } from "../../services/zoneService";
import Spinner from "../UI/Spinner"; // Adjust the import path as needed
import { getUserRole } from "../../utils/auth";

const Sidebar = ({
  vesselData,
  gatewayData,
  zoneData,
  hotspotData,
  selectedLocation,
  setSelectedLocation,
  refreshVessels,
  lastRefreshTime,
  refreshTrigger,
  onZoneCreated,
  fetchHotspots,
}) => {
  const [activeTab, setActiveTab] = useState("vessels");
  const [vesselSearchTerm, setVesselSearchTerm] = useState("");
  const [gatewaySearchTerm, setGatewaySearchTerm] = useState("");
  const [zoneSearchTerm, setZoneSearchTerm] = useState("");
  const [hotspotSearchTerm, setHotspotSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const userRole = getUserRole();

  // Handle deleting a zone
  const handleDeleteZone = async (zoneId) => {
    try {
      await deleteZone(zoneId);
      onZoneCreated();
    } catch (error) {
      console.error("Failed to delete zone:", error);
    }
  };

  // Handle editing a zone
  const handleEditZone = async () => {
    onZoneCreated();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "vessels":
        if (vesselData.loading) return <Spinner />;
        if (vesselData.error)
          return <p className="text-red-500">{vesselData.error}</p>;
        if (vesselData.locations.length === 0) return <p>No vessels found.</p>;
        return (
          <div className="space-y-2">
            {vesselData.locations
              .filter((item) =>
                item.name.toLowerCase().includes(vesselSearchTerm.toLowerCase())
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
        );

      case "gateways":
        if (gatewayData.loading) return <Spinner />;
        if (gatewayData.error)
          return <p className="text-red-500">{gatewayData.error}</p>;
        if (gatewayData.locations.length === 0)
          return <p>No gateways found.</p>;
        return (
          <div className="space-y-2">
            {gatewayData.locations
              .filter((item) =>
                item.name
                  .toLowerCase()
                  .includes(gatewaySearchTerm.toLowerCase())
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
        );

      case "zones":
        if (zoneData.loading) return <Spinner />;
        if (zoneData.error)
          return <p className="text-red-500">{zoneData.error}</p>;
        if (zoneData.zones.length === 0) return <p>No zones found.</p>;
        return (
          <>
            <ZoneSearch
              searchTerm={zoneSearchTerm}
              setSearchTerm={setZoneSearchTerm}
            />
            <div className="mb-4 px-2 flex items-center justify-end">
              {userRole === "admin" && (
                <ZoneCreater onZoneCreated={onZoneCreated} />
              )}
            </div>
            <ZoneList
              zones={zoneData.zones}
              searchTerm={zoneSearchTerm}
              onEdit={handleEditZone}
              onDelete={handleDeleteZone}
            />
          </>
        );

      case "hotspots":
        return (
          <div className="space-y-4 flex flex-col">
            {/* Period Filter Dropdown */}
            <div className="flex justify-end">
              <select
                value={selectedPeriod} // Bind the value to the state
                onChange={(e) => {
                  // Update the selected period state
                  setSelectedPeriod(e.target.value);
                  // Fetch hotspots based on the selected period
                  fetchHotspots(e.target.value);
                }}
                className="p-2 border border-gray-300 rounded-lg"
              >
                <option value="month">Last Month</option>
                <option value="year">This Year</option>
                <option value="last year">Last Year</option>
              </select>
            </div>

            {/* Loading State */}
            {hotspotData.loading && <Spinner />}

            {/* Error State */}
            {hotspotData.error && (
              <p className="text-red-500">{hotspotData.error}</p>
            )}

            {/* No Hotspots Found */}
            {!hotspotData.loading &&
              !hotspotData.error &&
              hotspotData.hotspots.length === 0 && <p>No hotspots found.</p>}

            {/* Hotspots List */}
            {!hotspotData.loading &&
              !hotspotData.error &&
              hotspotData.hotspots.length > 0 && (
                <div className="space-y-2 overflow-y-auto h-[700px]">
                  {hotspotData.hotspots
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
                          Status: {hotspot.status}
                        </p>
                        <p className="text-sm text-gray-600">
                          Last Updated:{" "}
                          {new Date(hotspot.currentDateTime).toLocaleString()}
                        </p>
                      </div>
                    ))}
                </div>
              )}
          </div>
        );
        
      default:
        return null;
    }
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

      {(activeTab === "vessels" ||
        activeTab === "gateways" ||
        activeTab === "hotspots") && (
        <input
          type="text"
          placeholder={`Search ${
            activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
          }...`}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={
            activeTab === "vessels"
              ? vesselSearchTerm
              : activeTab === "gateways"
              ? gatewaySearchTerm
              : hotspotSearchTerm
          }
          onChange={(e) =>
            activeTab === "vessels"
              ? setVesselSearchTerm(e.target.value)
              : activeTab === "gateways"
              ? setGatewaySearchTerm(e.target.value)
              : setHotspotSearchTerm(e.target.value)
          }
        />
      )}
      <div className="flex flex-col flex-1">{renderContent()}</div>
    </div>
  );
};

export default Sidebar;
