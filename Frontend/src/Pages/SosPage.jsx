import React, { useState, useEffect } from "react";
import SOSMessage from "../Components/Sos/SOSMessage";
import SOSPopup from "../Components/Sos/SOSPopup";
import { changeSOSStatus, fetchEnhancedSOSData } from "../services/sosService";
import useMultiPolling from "../hooks/useMultiPolling";

const SOSPage = () => {
  const [sosData, setSosData] = useState([]);
  const [selectedSOS, setSelectedSOS] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // State to manage tabs

  const getSOSData = async () => {
    try {
      const data = await fetchEnhancedSOSData();
      setSosData(data.reverse());
    } catch (error) {
      console.error("Error fetching SOS data:", error);
    } finally {
      setLoading(false); // Mark loading as complete
    }
  };

  useEffect(() => {
    getSOSData(); // Load initial SOS data
  }, []);

  useMultiPolling({
    onSOS: async () => {
      try {
        const latestSOS = await getSOSData(); // Refetch latest list
        setSosData(latestSOS); // Replace entire list or adjust as needed
      } catch (error) {
        console.error("Failed to fetch SOS data:", error);
      }
    },
  });

  const handleStatusChange = async (id) => {
    try {
      await changeSOSStatus(id, "resolved");
      setSosData((prev) =>
        prev.map((sos) =>
          sos._id === id ? { ...sos, sosStatus: "resolved" } : sos
        )
      );
      setSelectedSOS(null);
    } catch (error) {
      console.error("Error updating SOS status:", error);
    }
  };

  // Filter SOS data based on the active tab
  const filteredSOS = sosData.filter((sos) => sos.sosStatus === activeTab);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">SOS Alerts</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-4">
        <button
          className={`py-2 px-4 ${
            activeTab === "active" ? "border-b-2 border-blue-500 font-bold" : ""
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "resolved"
              ? "border-b-2 border-blue-500 font-bold"
              : ""
          }`}
          onClick={() => setActiveTab("resolved")}
        >
          Resolved
        </button>
      </div>

      {/* SOS Messages */}
      {loading ? (
        <p className="text-gray-500">Loading SOS messages...</p>
      ) : filteredSOS.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">
          There are no {activeTab} SOS messages.
        </p>
      ) : (
        <div className="grid gap-4">
          {filteredSOS.map((sos) => (
            <SOSMessage
              key={sos.id}
              sos={sos}
              onClick={() => setSelectedSOS(sos)}
            />
          ))}
        </div>
      )}

      {/* SOS Popup */}
      {selectedSOS && (
        <SOSPopup
          sos={selectedSOS}
          onClose={() => setSelectedSOS(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default SOSPage;
