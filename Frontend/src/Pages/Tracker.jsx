import React, { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "../Components/Tracker/Sidebar";
import TrackerMap from "../Components/Tracker/TrackerMap";
import {
  fetchLatestVesselLocations,
  fetchLatestGateWayLocations,
} from "../services/locationService";
import "leaflet/dist/leaflet.css";

const REFRESH_INTERVAL = 60000; // 60 seconds

const Tracker = () => {
  const [locations, setLocations] = useState([]);
  const [gateWayLocations, setGateWayLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [gw_SearchTerm, setgw_SearchTerm] = useState("");
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const intervalRef = useRef(null); // Store interval ID

  // Fetch latest vessel locations
  const fetchVesselData = useCallback(async () => {
    try {
      const data = await fetchLatestVesselLocations();
      const transformedData = data.map((loc) => ({
        id: loc.vesselId,
        type: "vessel",
        name: `vessel${loc.vesselId}`,
        lat: loc.lat,
        lng: loc.lng,
      }));
      setLocations(transformedData);
      setLastRefreshTime(Date.now());
      setRefreshTrigger((prev) => prev + 1); // Trigger timer reset
    } catch (error) {
      console.error("Failed to fetch vessel locations:", error);
    }
  }, []);

  // Fetch gateway locations (Only once on initial load)
  const fetchGatewayData = useCallback(async () => {
    try {
      const GWdata = await fetchLatestGateWayLocations();
      const transformedGWData = GWdata.map((loc) => ({
        id: loc.gatewayId,
        type: "gateway",
        name: loc.gatewayName,
        lat: loc.lat,
        lng: loc.lng,
      }));
      setGateWayLocations(transformedGWData);
    } catch (error) {
      console.error("Failed to fetch gateway locations:", error);
    }
  }, []);

  // Function to start a new interval for vessel data fetching
  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Clear any existing interval
    }
    intervalRef.current = setInterval(fetchVesselData, REFRESH_INTERVAL);
  }, [fetchVesselData]);

  // Initial Data Fetching
  useEffect(() => {
    fetchVesselData(); // Fetch vessel data initially
    fetchGatewayData(); // Fetch gateway data only once
    startAutoRefresh(); // Start auto-refresh

    return () => clearInterval(intervalRef.current); // Cleanup interval on unmount
  }, [fetchVesselData, fetchGatewayData, startAutoRefresh]);

  // Manual Refresh Function
  const handleManualRefresh = () => {
    clearInterval(intervalRef.current); // Stop the existing interval
    fetchVesselData(); // Fetch immediately
    startAutoRefresh(); // Restart auto-refresh with correct timing
  };

  return (
    <div className="flex h-full">
      <TrackerMap
        locations={[...locations, ...gateWayLocations]}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />

      <Sidebar
        vessels={locations}
        gateways={gateWayLocations}
        vesselSearchTerm={searchTerm}
        setVesselSearchTerm={setSearchTerm}
        gatewaySearchTerm={gw_SearchTerm}
        setGatewaySearchTerm={setgw_SearchTerm}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        refreshVessels={handleManualRefresh}
        lastRefreshTime={lastRefreshTime}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
};

export default Tracker;