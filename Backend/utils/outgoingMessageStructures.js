// Function to format data based on type
function formatoutgoingMessage(msgdata, type) {
  console.log("🚀 ~ formatoutgoingMessage ~ msgdata:", msgdata)
  if (!msgdata || !type) {
    throw new Error("message data and type are required.");
  }

  switch (type) {
    case "chat":
      return formatChatMessage(msgdata);
    case "soschat":
      return formatSosChatMessage(msgdata);
    case "sos":
      return formatSosMessage(msgdata);

    // Future case for other types can be added here
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

// Helper function to format chat message
function formatChatMessage(msgdata) {
  const { vesselId, messageId, messageNumber } = msgdata;

  if (!vesselId || !messageId || !messageNumber) {
    throw new Error(
      "message data must include vesselId, messageId, and messageNumber."
    );
  }

  return {
    id: `${vesselId}|${messageId}`,
    m: messageNumber,
  };
}

// Helper function to format sos chat message
function formatSosChatMessage(msgdata) {
  const { vesselId, messageId, messageNumber, lat, lng } = msgdata;

  if (!vesselId || !messageId || !lat || !lng) {
    throw new Error(
      "message data must include vesselId, messageId, messageNumber, lat and lng."
    );
  }

  return {
    id: `${vesselId}|${messageId}`,
    l: `${lat}|${lng}`,
    m: messageNumber,
  };
}

// Helper function to format sos message
function formatSosMessage(msgdata) {
  const { vesselId, sosId, s } = msgdata;

  if (!vesselId || !sosId || !s) {
    throw new Error("message data must include vesselId, sosId, and s.");
  }

  return {
    id: `${vesselId}|${sosId}`,
    s,
  };
}

module.exports = { formatoutgoingMessage };
