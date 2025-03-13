import React, { useState, useEffect, useCallback } from "react";
import VesselList from "../Components/Chat/VesselList";
import ChatWindow from "../Components/Chat/ChatWindow";
import { fetchVessels } from "../services/locationService";
import { fetchLatestChats } from "../services/chatService";
import { fetchZones } from "../services/zoneService";

const ChatPage = () => {
  const [vessels, setVessels] = useState([]);
  const [latestChats, setLatestChats] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [showNewChatPopup, setShowNewChatPopup] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      const vesselsData = await fetchVessels();
      const latestChatsData = await fetchLatestChats();
      const zonesData = await fetchZones();

      setVessels(vesselsData);
      setLatestChats(latestChatsData);
      setZones(zonesData);
    };

    loadData();
  }, []);

  // Filter vessels with and without chats
  const vesselsWithChats = vessels.filter((vessel) =>
    latestChats.some((chat) => chat.vesselId === vessel.vesselId)
  );
  const vesselsWithoutChats = vessels.filter(
    (vessel) => !latestChats.some((chat) => chat.vesselId === vessel.vesselId)
  );

  // Handle vessel selection from the new chat popup
  const handleNewChatSelect = (vessel) => {
    setSelectedVessel(vessel);
    setShowNewChatPopup(false); // Close the popup
  };

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setShowNewChatPopup(false);
    }
  }, []);

  return (
    <div className="h-full bg-gray-100">
      {/* New Chat Popup */}
      {showNewChatPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-800">New Chat</h2>
            <ul>
              {vesselsWithoutChats.map((vessel) => (
                <li
                  key={vessel.vesselId}
                  className="bg-white p-3 rounded-lg mb-2 shadow-md flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleNewChatSelect(vessel)}
                >
                  {/* Vessel Details */}
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg text-blue-600">
                      {vessel.vesselName}
                    </h2>
                  </div>
                </li>
              ))}
            </ul>
            <button
              className="mt-4 w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
              onClick={() => setShowNewChatPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!selectedVessel ? (
        <div>
          <VesselList
            vessels={vesselsWithChats}
            latestChats={latestChats}
            onSelect={setSelectedVessel}
            onNewChatClick={() => setShowNewChatPopup(true)}
          />
        </div>
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
