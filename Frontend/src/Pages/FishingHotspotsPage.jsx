import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getAllFishingHotspotsdirect } from "../services/locationService";
import FlyToMarker from "../Components/Map/FlyToMarker";

const defaultCenter = [6.7115, 79.9044];

const FishingHotspotsPage = () => {
  const [allLocationsData, setAllLocationsData] = useState(null);
  const [allLocationsError, setAllLocationsError] = useState(null);
  const [allLocationsLoading, setAllLocationsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchAllLocations = async () => {
      try {
        const response = await getAllFishingHotspotsdirect();
        //console.log("🚀 ~ fetchAllLocations ~ response:", response);
        setAllLocationsData(response);
      } catch (err) {
        setAllLocationsError(err.message || "An unexpected error occurred.");
      } finally {
        setAllLocationsLoading(false);
      }
    };

    fetchAllLocations();
  }, []);

  const handleLocationClick = (hotspot) => {
    setSelectedLocation({ lat: hotspot.latitude, lng: hotspot.longitude });
  };

  return (
    <div className="h-screen w-full p-4 flex">
      {/* Map Section */}
      <div className="flex-grow">
        <MapContainer
          center={defaultCenter}
          zoom={8}
          className="h-full w-full rounded-lg"
          whenCreated={(map) => (mapRef.current = map)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
          {allLocationsData &&
            allLocationsData.map((hotspot) => (
              <Marker
                key={hotspot.hotspotId}
                position={[hotspot.latitude, hotspot.longitude]}
              >
                <Popup>
                  <div>
                    <p>
                      <strong>Hotspot ID:</strong> {hotspot.hotspotId}
                    </p>
                    <p>
                      <strong>Vessels:</strong> {hotspot.vesselCount}
                    </p>
                    <p>
                      <strong>Available Slots:</strong> {hotspot.availableSlots}
                    </p>
                    <p>
                      <strong>Last Updated:</strong> {new Date(hotspot.currentDateTime).toLocaleString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          {selectedLocation && (
            <FlyToMarker position={[selectedLocation.lat, selectedLocation.lng]} />
          )}
        </MapContainer>
      </div>
      
      {/* Sidebar Section */}
      <div className="w-1/4 p-4 overflow-y-auto border-l">
        <h2 className="text-lg font-semibold mb-2">Hotspot Locations</h2>
        {allLocationsData ? (
          allLocationsData.map((hotspot) => (
            <div
              key={hotspot.hotspotId}
              className="p-2 border my-3 cursor-pointer hover:bg-gray-200 rounded-lg"
              onClick={() => handleLocationClick(hotspot)}
            >
              <p><strong>Hotspot ID:</strong> {hotspot.hotspotId}</p>
              <p><strong>Vessels:</strong> {hotspot.vesselCount}</p>
              <p><strong>Available Slots:</strong> {hotspot.availableSlots}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Loading locations...</p>
        )}
      </div>
    </div>
  );
};

export default FishingHotspotsPage;