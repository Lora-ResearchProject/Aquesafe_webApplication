import React, { useState, useEffect } from "react";
import SOSMessage from "../Components/Sos/SOSMessage";
import SOSPopup from "../Components/Sos/SOSPopup";
import { fetchSOSData, changeSOSStatus } from "../services/sosService";

const SOSPage = () => {
  const [sosData, setSosData] = useState([]);
  const [selectedSOS, setSelectedSOS] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch SOS data when the component mounts
  useEffect(() => {
    const getSOSData = async () => {
      try {
        const data = await fetchSOSData();

        setSosData(data);
      } catch (error) {
        console.error("Error fetching SOS data:", error);
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };
    getSOSData();
  }, []);

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">SOS Alerts</h1>
      {loading ? (
        <p className="text-gray-500">Loading SOS messages...</p>
      ) : sosData.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">
          There are no SOS messages.
        </p>
      ) : (
        <div className="grid gap-4">
          {sosData.map((sos) => (
            <SOSMessage
              key={sos.id}
              sos={sos}
              onClick={() => setSelectedSOS(sos)}
            />
          ))}
        </div>
      )}
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
