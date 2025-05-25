const Zone = require("../models/Zone");
const Vessel = require("../models/vesselModel");
const Chat = require("../models/chatModel");
const { generateId } = require("../utils/idGenerator");
const { notifyClients } = require("../controllers/longPollController");
const { formatoutgoingMessage } = require("../utils/outgoingMessageStructures");
const { sendToGateway } = require("./outgoingMessageService");
const { getFilteredVesselLocations } = require("./cerService");
const { isVesselInZone } = require("../utils/vesselZone");
const { createNotification } = require("../controllers/notificationController");

// Fetch all danger zones
const getDangerZones = async () => {
  try {
    return await Zone.find({ zoneType: "danger" });
  } catch (error) {
    console.error("Error fetching danger zones:", error);
    throw new Error("Failed to retrieve danger zones.");
  }
};

// Save and send a proximity alert message
const saveAlertMessage = async (vesselId, message, messageNumber) => {
  try {
    const messageId = generateId();

    const newChat = new Chat({
      messageId,
      vesselId,
      dateTime: new Date(),
      messageNumber,
      message,
      direction: "receive", // System sending alert to vessel
    });

    // Prepare formatted message for external gateway (to be used when sendToGateway is uncommented)
    const formattedMessage = formatoutgoingMessage(
      {
        vesselId,
        messageId,
        messageNumber,
        message, // Include message content for gateway
      },
      "chat"
    );

    const externalServerUrl = process.env.GATEWAY_API_URL;
    //await sendToGateway(externalServerUrl, formattedMessage); // Uncomment when ready

    const savedChat = await newChat.save();
    notifyClients("chat");

    return savedChat;
  } catch (error) {
    console.error("Error saving alert message:", error);
    throw new Error("Failed to save alert message.");
  }
};

// Send proximity alerts based on alert type
const sendProximityAlert = async (vesselId, alertType) => {
  const message =
    alertType === "enter"
      ? "Alert: You have entered a danger zone"
      : "Alert: You have exited the danger zone";

  const messageNumber = alertType === "enter" ? 1 : 2; // Use decimal instead of octal-like numbers
  await saveAlertMessage(vesselId, message, messageNumber);

  const messageTitle =
    alertType === "enter" ? "Danger Zone Entry" : "Danger Zone Exit";
  const messageDescription =
    alertType === "enter"
      ? `Vessel ${vesselId} has entered a danger zone.`
      : `Vessel ${vesselId} has exited a danger zone.`;

  // Create notification
  await createNotification({
    messageTitle,
    messageDescription,
    Type: "danger",
  });
};

// Check and send proximity alerts for vessels
const checkProximityAlerts = async () => {
  try {
    // Step 1: Fetch all danger zones
    const dangerZones = await getDangerZones();
    if (!dangerZones.length) {
      console.log("No danger zones found.");
      return;
    }

    // Step 2: Fetch all latest vessel locations
    const latestVesselLocations = await getFilteredVesselLocations();
    if (!latestVesselLocations.length) {
      console.log("No recent vessel locations found.");
      return;
    }

    // Step 3: Fetch danger states only for vessels with recent locations
    const vesselIds = latestVesselLocations.map((v) => v.vesselId);
    const vessels = await Vessel.find(
      { vesselId: { $in: vesselIds } },
      "vesselId danger"
    );
    const vesselDangerMap = new Map(vessels.map((v) => [v.vesselId, v.danger]));

    // Step 4: Process each vessel location
    for (const vesselLocation of latestVesselLocations) {
      const { vesselId, lat, lng } = vesselLocation;

      // Check if vessel is in any danger zone
      const isInDanger = dangerZones.some((zone) =>
        isVesselInZone(vesselLocation, zone)
      );
      const currentDangerState = vesselDangerMap.get(vesselId) || false;

      if (isInDanger && !currentDangerState) {
        // Vessel entered a danger zone
        await Vessel.updateOne({ vesselId }, { danger: true });
        await sendProximityAlert(vesselId, "enter");
        console.log(`Vessel ${vesselId} entered a danger zone.`);
      } else if (!isInDanger && currentDangerState) {
        // Vessel exited all danger zones
        await Vessel.updateOne({ vesselId }, { danger: false });
        await sendProximityAlert(vesselId, "exit");
        console.log(`Vessel ${vesselId} exited all danger zones.`);
      }
      // No action if state hasn't changed
    }
  } catch (error) {
    console.error("Error in checkProximityAlerts:", error);
  }
};

// Wrapper function to start proximity alert checks
const startProximityAlertChecks = () => {
  let isRunning = false;

  async function runCheck() {
    if (isRunning) {
      console.log("Proximity check already in progress, skipping this run.");
      return;
    }
    isRunning = true;
    try {
      await checkProximityAlerts();
    } catch (error) {
      console.error("Error in runCheck:", error);
    } finally {
      isRunning = false;
    }
  }

  // Run immediately on start
  runCheck();

  // Schedule to run every 60 seconds
  setInterval(runCheck, 60000);
};

module.exports = { checkProximityAlerts, startProximityAlertChecks };
