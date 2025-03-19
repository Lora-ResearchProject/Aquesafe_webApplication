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
  const [vesselData, setVesselData] = useState({
    locations: [],
    loading: true,
    error: null,
  });
  const [gatewayData, setGatewayData] = useState({
    locations: [],
    loading: true,
    error: null,
  });
  const [zoneData, setZoneData] = useState({
    zones: [],
    loading: true,
    error: null,
  });
  const [hotspotData, setHotspotData] = useState({
    hotspots: [],
    loading: true,
    error: null,
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const intervalRef = useRef(null);

  // Fetch vessel locations
  const fetchVesselData = useCallback(async () => {
    setVesselData((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchLatestVesselLocations();
      const transformedData = data.map((loc) => ({
        id: loc.vesselId,
        type: "vessel",
        name: `vessel${loc.vesselId}`,
        lat: loc.lat,
        lng: loc.lng,
      }));
      setVesselData({
        locations: transformedData,
        loading: false,
        error: null,
      });
      setLastRefreshTime(Date.now());
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      setVesselData((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to fetch vessel locations",
      }));
    }
  }, []);

  // Fetch gateway locations
  const fetchGatewayData = useCallback(async () => {
    setGatewayData((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const GWdata = await fetchLatestGateWayLocations();
      const transformedGWData = GWdata.map((loc) => ({
        id: loc.gatewayId,
        type: "gateway",
        name: loc.gatewayName,
        lat: loc.lat,
        lng: loc.lng,
      }));
      setGatewayData({
        locations: transformedGWData,
        loading: false,
        error: null,
      });
    } catch (error) {
      setGatewayData((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to fetch gateway locations",
      }));
    }
  }, []);

  // Fetch zones
  const fetchAllZones = useCallback(async () => {
    setZoneData((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const fetchedZones = await fetchZones();
      setZoneData({ zones: fetchedZones, loading: false, error: null });
    } catch (error) {
      setZoneData((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to fetch zones",
      }));
    }
  }, []);

  // Fetch hotspots with optional period parameter
const fetchHotspots = useCallback(async (period = "month") => {
  setHotspotData((prev) => ({ ...prev, loading: true, error: null }));
  try {
    // Fetch hotspots for the specified period
    const fetchedHotspots = await fetchAllFishingHotspots({ period });
    setHotspotData({
      hotspots: fetchedHotspots,
      loading: false,
      error: null,
    });
  } catch (error) {
    setHotspotData((prev) => ({
      ...prev,
      loading: false,
      error: "Failed to fetch hotspots",
    }));
  }
}, []);

  // Auto-refresh for vessels
  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchVesselData, REFRESH_INTERVAL);
  }, [fetchVesselData]);

  // Initial fetch and cleanup
  useEffect(() => {
    fetchVesselData();
    fetchGatewayData();
    fetchAllZones();
    fetchHotspots("month");
    startAutoRefresh();

    return () => clearInterval(intervalRef.current);
  }, [
    fetchVesselData,
    fetchGatewayData,
    fetchAllZones,
    fetchHotspots,
    startAutoRefresh,
  ]);

  // Manual refresh
  const handleManualRefresh = () => {
    clearInterval(intervalRef.current);
    fetchVesselData();
    startAutoRefresh();
  };

  // Refresh zones when a new zone is created
  const handleZoneCreated = () => {
    fetchAllZones();
  };

  return (
    <div className="flex h-full">
      <TrackerMap
        vesselData={vesselData}
        gatewayData={gatewayData}
        zoneData={zoneData}
        hotspotData={hotspotData}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />
      <Sidebar
        vesselData={vesselData}
        gatewayData={gatewayData}
        zoneData={zoneData}
        hotspotData={hotspotData}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        refreshVessels={handleManualRefresh}
        lastRefreshTime={lastRefreshTime}
        refreshTrigger={refreshTrigger}
        onZoneCreated={handleZoneCreated}
        fetchHotspots={fetchHotspots}
      />
    </div>
  );
};

export default Tracker;
