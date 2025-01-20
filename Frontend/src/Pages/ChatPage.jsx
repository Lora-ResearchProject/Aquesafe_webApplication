import React, { useState, useEffect } from "react";
import axios from "axios";
import VesselList from "../Components/Chat/VesselList";
import ChatWindow from "../Components/Chat/ChatWindow";
import { baseURL } from "../config/config";

const ChatPage = () => {
  const [vessels, setVessels] = useState([]);
  const [selectedVessel, setSelectedVessel] = useState(null);

  useEffect(() => {
    // Fetch all vessels
    const fetchVessels = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/vessel-auth/`);
        setVessels(response.data.data); // Expecting { vesselId, vesselName }
      } catch (error) {
        console.error("Failed to fetch vessels:", error);
      }
    };

    fetchVessels();
  }, []);

  return (
    <div className="h-full bg-gray-100">
      {!selectedVessel ? (
        <VesselList vessels={vessels} onSelect={setSelectedVessel} />
      ) : (
        <ChatWindow
          vessel={selectedVessel}
          onBack={() => setSelectedVessel(null)}
        />
      )}
    </div>
  );
};

export default ChatPage;
