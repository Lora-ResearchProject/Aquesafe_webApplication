const Chat = require("../models/chatModel");
const { fetchAllVesselLocations } = require("./vesselLocationService");
const { generateId } = require("../utils/idGenerator");
const { formatoutgoingMessage } = require("../utils/outgoingMessageStructures");
const { sendToGateway } = require("./outgoingMessageService");


const Range = 10; // 10km

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
          if (!acc[vesselId] || currentDateTime > new Date(acc[vesselId].dateTime)) {
            acc[vesselId] = { vesselId, dateTime, lat, lng };
          }
        }
        
        return acc;
      }, {})
        
    );
    return latestLocations.filter((vessel) => vessel.vesselId !== excludeVesselId);
    
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
    console.log("🚀 ~ getNearbyVessels ~ vessels:", vessels)

    return vessels
      .filter((vessel) => haversine(lat, lng, vessel.lat, vessel.lng) <= Range)
      .map((vessel) => vessel.vesselId);
  } catch (error) {
    console.error("Error finding nearby vessels:", error);
    throw new Error("Failed to find nearby vessels.");
  }
};

const saveAndSendMessage = async (vesselId, lat, lng) => {
  console.log("🚀 ~ saveAndSendMessage ~ vesselId, lat, lng:", vesselId, lat, lng)
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

    //await sendToGateway(externalServerUrl, formattedMessage); // -------------------------------------------------------------- need to uncomment this after fix this
    const savedChat = await newChat.save();

    return savedChat;
  } catch (error) {
    console.error("Error saving and sending message:", error);
    throw new Error("Failed to process message.");
  }
};

const alertNearbyVessels = async (requestingVesselId, lat, lng) => {
  try {
    const nearbyVessels = await getNearbyVessels(requestingVesselId, lat, lng);
    console.log("🚀 ~ alertNearbyVessels ~ nearbyVessels:", nearbyVessels)

    if (nearbyVessels.length === 0) {
      console.log("No nearby vessels found within the 10km range.");
      return [];
    }

    console.log(`Notifying ${nearbyVessels.length} vessels:`, nearbyVessels);

    const sendMessages = nearbyVessels.map((vesselId) => saveAndSendMessage(vesselId, lat, lng));
    return await Promise.all(sendMessages);
  } catch (error) {
    console.error("Error alerting nearby vessels:", error);
    throw new Error("Failed to alert nearby vessels.");
  }
};

module.exports = { getNearbyVessels, saveAndSendMessage, alertNearbyVessels };