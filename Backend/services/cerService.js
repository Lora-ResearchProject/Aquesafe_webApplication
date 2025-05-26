const Chat = require("../models/chatModel");
const { fetchAllVesselLocations } = require("./vesselLocationService");
const { generateId } = require("../utils/idGenerator");
const { formatoutgoingMessage } = require("../utils/outgoingMessageStructures");
const { sendToGateway } = require("./outgoingMessageService");
const { notifyClients } = require("../controllers/longPollController");

const range = 5; // 5km

const getFilteredVesselLocations = async (excludeVesselId) => {
  try {
    const allVesselData = await fetchAllVesselLocations();

    if (!Array.isArray(allVesselData) || allVesselData.length === 0) {
      return [];
    }

    const currentTime = new Date();
    const tenHoursAgo = new Date(currentTime.getTime() - 10 * 60 * 60 * 1000);

    const latestLocations = Object.values(
      allVesselData.reduce((acc, location) => {
        const { vesselId, dateTime, lat, lng } = location;
        const currentDateTime = new Date(dateTime);

        if (currentDateTime >= tenHoursAgo) {
          if (
            !acc[vesselId] ||
            currentDateTime > new Date(acc[vesselId].dateTime)
          ) {
            acc[vesselId] = { vesselId, dateTime, lat, lng };
          }
        }

        return acc;
      }, {})
    );
    return latestLocations.filter(
      (vessel) => vessel.vesselId !== excludeVesselId
    );
  } catch (error) {
    console.error("Error fetching vessel locations:", error);
    throw new Error("Failed to retrieve vessel locations.");
  }
};

const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const toRad = (angle) => angle * (Math.PI / 180);

  let dLat = toRad(lat2 - lat1);
  let dLon = toRad(lon2 - lon1);
  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  let a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const getNearbyVessels = async (excludeVesselId, lat, lng) => {
  try {
    const vessels = await getFilteredVesselLocations(excludeVesselId);

    return vessels
      .filter((vessel) => haversine(lat, lng, vessel.lat, vessel.lng) <= range)
      .map((vessel) => vessel.vesselId);
  } catch (error) {
    console.error("Error finding nearby vessels:", error);
    throw new Error("Failed to find nearby vessels.");
  }
};

const saveAndSendMessage = async (vesselId, lat, lng) => {
  try {
    const messageId = generateId();
    const messageNumber = 0;
    const message = `SOS Alert! A vessel needs help nearby. Location: [${lat}, ${lng}].`;

    const newChat = new Chat({
      messageId,
      vesselId,
      dateTime: new Date(),
      messageNumber,
      message,
      direction: "send",
    });

    const formattedMessage = formatoutgoingMessage(
      {
        vesselId: vesselId,
        messageId: messageId,
        messageNumber: messageNumber,
        lat,
        lng,
      },
      "soschat"
    );

    const externalServerUrl = process.env.GATEWAY_API_URL;

    await sendToGateway(externalServerUrl, formattedMessage); // -------------------------------------------------------------- need to uncomment this after fix this
    const savedChat = await newChat.save();

    notifyClients('chat');

    return savedChat;
  } catch (error) {
    console.error("Error saving and sending message:", error);
    throw new Error("Failed to process message.");
  }
};

const alertNearbyVessels = async (requestingVesselId, lat, lng) => {
  try {
    const nearbyVessels = await getNearbyVessels(requestingVesselId, lat, lng);

    if (nearbyVessels.length === 0) {
      const message = `No vessels detected within the ${range}km range for alerting.`;
      console.log(message);
      return { success: false, message };
    }

    console.log(`Notifying ${nearbyVessels.length} vessels:`, nearbyVessels);

    await Promise.all(
      nearbyVessels.map((vesselId) => saveAndSendMessage(vesselId, lat, lng))
    );

    return {
      success: true,
      message: `Emergency alerts have been transmitted to ${nearbyVessels.length} vessels in the ${range}km area`,
    };
  } catch (error) {
    console.error("Error alerting nearby vessels:", error);
    throw new Error("Failed to alert nearby vessels.");
  }
};

module.exports = {
  getNearbyVessels,
  saveAndSendMessage,
  alertNearbyVessels,
  getFilteredVesselLocations,
};
