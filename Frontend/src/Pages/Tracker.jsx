import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Tracker/Sidebar";
import TrackerMap from "../Components/Tracker/TrackerMap";
import { fetchLatestVesselLocations } from "../services/locationService";
import "leaflet/dist/leaflet.css";

const Tracker = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLatestVesselLocations();

        // Transform the data to include type and name
        const transformedData = data.map((loc) => ({
          id: loc.vesselId,
          type: "vessel",
          name: `vessel${loc.vesselId}`,
          lat: loc.lat,
          lng: loc.lng,
        }));

        setLocations(transformedData);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    // Initial fetch
    fetchData();

    // Set interval to fetch data every minute
    const interval = setInterval(fetchData, 60000); // 60000ms = 1 minute

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full">
      <TrackerMap
        locations={locations}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />

      <Sidebar
        locations={locations}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />
    </div>
  );
};

export default Tracker;

// const data = [
//   // Colombo Gateways (on the beach)
//   { id: 1, type: "gateway", name: "Colombo Gateway 001", lat: 6.9271, lng: 79.8612 }, // Galle Face Beach

//   // Colombo Vessels (in the sea)
//   { id: 3, type: "vessel", name: "Colombo Vessel 001", lat: 6.9400, lng: 79.7750 },  // Offshore, Colombo

//   // Moratuwa Gateways (on the beach)
//   { id: 5, type: "gateway", name: "Moratuwa Gateway 001", lat: 6.7944, lng: 79.8824 }, // Moratuwa Beach

//   // Moratuwa Vessels (in the sea)
//   { id: 7, type: "vessel", name: "Moratuwa Vessel 001", lat: 6.8000, lng: 79.7900 },  // Offshore, Moratuwa

//   // Panadura Gateways (on the beach)
//   { id: 9, type: "gateway", name: "Panadura Gateway 001", lat: 6.7115, lng: 79.9044 }, // Panadura Beach

//   // Panadura Vessels (in the sea)
//   { id: 11, type: "vessel", name: "Panadura Vessel 001", lat: 6.7130, lng: 79.7095 },  // Offshore, Panadura

//   // Wadduwa Gateways (on the beach)
//   { id: 13, type: "gateway", name: "Wadduwa Gateway 001", lat: 6.6360, lng: 79.9434 }, // Wadduwa Beach

//   // Wadduwa Vessels (in the sea)
//   { id: 15, type: "vessel", name: "Wadduwa Vessel 001", lat: 6.6400, lng: 79.7500 },  // Offshore, Wadduwa

// ];
