import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchMessageOptions,
  sendMessageToAllVessels,
  sendMessageToZone,
} from "../../services/chatService";
import { fetchZones, getVesselsByZone } from "../../services/zoneService";
import MpZoneSelector from "./MpZoneSelector";
import MpMessageDropdown from "./MpMessageDropdown";
import MpVesselList from "./MpVesselList";

const MessagePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [messageTarget, setMessageTarget] = useState(null); // "all" or "zone"
  const [dropdownOptions, setDropdownOptions] = useState([]); // Predefined messages
  const [selectedMessage, setSelectedMessage] = useState(null); // Selected message
  const [zones, setZones] = useState([]); // List of zones
  const [selectedZone, setSelectedZone] = useState("all"); // Selected zone
  const [vessels, setVessels] = useState([]); // List of vessels
  const [loading, setLoading] = useState({
    options: true,
    zones: true,
    vessels: true,
    send: false,
  });
  const [error, setError] = useState(""); // Error message

  // Fetch predefined messages when popup opens
  useEffect(() => {
    if (showPopup) {
      const loadMessages = async () => {
        setLoading((prev) => ({ ...prev, options: true }));
        setError("");
        try {
          const data = await fetchMessageOptions();
          setDropdownOptions(data);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          setError("Failed to load messages. Please try again.");
        } finally {
          setLoading((prev) => ({ ...prev, options: false }));
        }
      };

      loadMessages();
    }
  }, [showPopup]);

  // Fetch zones when popup opens
  useEffect(() => {
    if (showPopup) {
      const loadZones = async () => {
        setLoading((prev) => ({ ...prev, zones: true }));
        setError("");
        try {
          const data = await fetchZones();
          setZones(data);
        } catch (error) {
          console.error("Failed to fetch zones:", error);
          setError("Failed to load zones. Please try again.");
        } finally {
          setLoading((prev) => ({ ...prev, zones: false }));
        }
      };

      loadZones();
    }
  }, [showPopup]);

  // Fetch vessels based on selected zone or all vessels
  useEffect(() => {
    if (showPopup) {
      const loadVessels = async () => {
        setLoading((prev) => ({ ...prev, vessels: true }));
        setError("");
        try {
          const data =
            messageTarget === "zone"
              ? await getVesselsByZone(selectedZone)
              : await getVesselsByZone("all");
          setVessels(data);
        } catch (error) {
          console.error("Failed to fetch vessels:", error);
          setError("Failed to load vessels. Please try again.");
        } finally {
          setLoading((prev) => ({ ...prev, vessels: false }));
        }
      };

      loadVessels();
    }
  }, [showPopup, messageTarget, selectedZone]);

  // Handle sending a message
  const handleSendMessage = useCallback(async () => {
    if (!selectedMessage) {
      setError("Please select a message.");
      return;
    }

    setLoading((prev) => ({ ...prev, send: true }));
    setError("");

    try {
      if (messageTarget === "all") {
        await sendMessageToAllVessels(
          selectedMessage.messageNumber,
          selectedMessage.message
        );
      } else {
        await sendMessageToZone(
          selectedZone,
          selectedMessage.messageNumber,
          selectedMessage.message
        );
      }
      setShowPopup(false); // Close popup on success
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, send: false }));
    }
  }, [selectedMessage, messageTarget, selectedZone]);

  // Close popup when clicking outside (backdrop)
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setShowPopup(false);
    }
  }, []);

  // Disable Send button if no message is selected or (for zones) no zone is selected
  const isSendDisabled = useMemo(
    () =>
      !selectedMessage || (messageTarget === "zone" && selectedZone === "all"),
    [selectedMessage, messageTarget, selectedZone]
  );

  return (
    <div>
      {/* Buttons to open popup */}
      <div className="flex gap-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => {
            setMessageTarget("all");
            setShowPopup(true);
          }}
        >
          Send to All Vessels
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          onClick={() => {
            setMessageTarget("zone");
            setShowPopup(true);
          }}
        >
          Send to Selected Zone
        </button>
      </div>

      {/* Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white p-6 rounded-lg shadow-xl w-2/6 max-w-2xl">
            {/* Popup Title */}
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {messageTarget === "all"
                ? "Send Message to All Vessels"
                : "Send Message to Selected Zone"}
            </h2>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {/* Zone Selector (only for "Send to Selected Zone") */}
            {messageTarget === "zone" && (
              <MpZoneSelector
                zones={zones}
                selectedZone={selectedZone}
                setSelectedZone={setSelectedZone}
                loading={loading.zones}
              />
            )}

            {/* Vessel List */}
            <MpVesselList vessels={vessels} loading={loading.vessels} />

            {/* Message Dropdown */}
            <MpMessageDropdown
              dropdownOptions={dropdownOptions}
              selectedMessage={selectedMessage}
              setSelectedMessage={setSelectedMessage}
              loading={loading.options}
            />

            

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                onClick={() => setShowPopup(false)}
                disabled={loading.send}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  isSendDisabled || loading.send
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
                onClick={handleSendMessage}
                disabled={isSendDisabled || loading.send}
              >
                {loading.send ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MessagePopup;
