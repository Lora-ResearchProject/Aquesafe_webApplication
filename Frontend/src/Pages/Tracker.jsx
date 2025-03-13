import React, { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "../Components/Tracker/Sidebar";
import TrackerMap from "../Components/Tracker/TrackerMap";
import {
  fetchLatestVesselLocations,
  fetchLatestGateWayLocations,
  fetchAllFishingHotspots,
} from "../services/locationService";
import { fetchZones } from "../services/zoneService";
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
  const [zones, setZones] = useState([]);
  const [hotspots, setHotspots] = useState([]);

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

  // Fetch all zones
  const fetchAllZones = useCallback(async () => {
    try {
      const fetchedZones = await fetchZones();
      setZones(fetchedZones); // Set fetched zones to the state
    } catch (error) {
      console.error("Failed to fetch zones:", error);
    }
  }, []);

   // Fetch all zones
   const fetchHotspots = useCallback(async () => {
    try {
      const fetchedHotspots = await fetchAllFishingHotspots();
      setHotspots(fetchedHotspots); // Set fetched zones to the state
    } catch (error) {
      console.error("Failed to fetch zones:", error);
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
    fetchAllZones(); // Fetch zones initially
    fetchHotspots();
    startAutoRefresh(); // Start auto-refresh

    return () => clearInterval(intervalRef.current); // Cleanup interval on unmount
  }, [fetchVesselData, fetchGatewayData, fetchAllZones,fetchHotspots, startAutoRefresh]);

  // Manual Refresh Function
  const handleManualRefresh = () => {
    clearInterval(intervalRef.current); // Stop the existing interval
    fetchVesselData(); // Fetch immediately
    startAutoRefresh(); // Restart auto-refresh with correct timing
  };

  // Handle the zone created event to refresh zones
  const handleZoneCreated = () => {
    fetchAllZones(); // Refresh zones after a new zone is created
  };

  return (
    <div className="flex h-full">
      <TrackerMap
        locations={[...locations, ...gateWayLocations]}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        zones={zones}
        hotspots={hotspots}
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
        onZoneCreated={handleZoneCreated}
        zones={zones}
        hotspots={hotspots}
      />
    </div>
  );
};

export default Tracker;
