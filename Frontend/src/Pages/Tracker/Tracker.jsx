import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TrackerMap from "./TrackerMap";
import { fetchLocations } from "../../services/locationService";
import "leaflet/dist/leaflet.css";

const Tracker = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {

    const data = [
      // Colombo Gateways (on the beach)
      { id: 1, type: "gateway", name: "Colombo Gateway 001", lat: 6.9271, lng: 79.8612 }, // Galle Face Beach

      // Colombo Vessels (in the sea)
      { id: 3, type: "vessel", name: "Colombo Vessel 001", lat: 6.9400, lng: 79.7750 },  // Offshore, Colombo

      // Moratuwa Gateways (on the beach)
      { id: 5, type: "gateway", name: "Moratuwa Gateway 001", lat: 6.7944, lng: 79.8824 }, // Moratuwa Beach

      // Moratuwa Vessels (in the sea)
      { id: 7, type: "vessel", name: "Moratuwa Vessel 001", lat: 6.8000, lng: 79.7900 },  // Offshore, Moratuwa

      // Panadura Gateways (on the beach)
      { id: 9, type: "gateway", name: "Panadura Gateway 001", lat: 6.7115, lng: 79.9044 }, // Panadura Beach

      // Panadura Vessels (in the sea)
      { id: 11, type: "vessel", name: "Panadura Vessel 001", lat: 6.7130, lng: 79.7095 },  // Offshore, Panadura
            
      // Wadduwa Gateways (on the beach)
      { id: 13, type: "gateway", name: "Wadduwa Gateway 001", lat: 6.6360, lng: 79.9434 }, // Wadduwa Beach

      // Wadduwa Vessels (in the sea)
      { id: 15, type: "vessel", name: "Wadduwa Vessel 001", lat: 6.6400, lng: 79.7500 },  // Offshore, Wadduwa
      
    ];
    
    //fetchLocations().then((data) => setLocations(data));

    setLocations(data);
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
