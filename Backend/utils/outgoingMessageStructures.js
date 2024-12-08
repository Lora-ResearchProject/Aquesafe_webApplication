// Function to format data based on type
function formatoutgoingMessage(msgdata, type) {
  if (!msgdata || !type) {
    throw new Error("message data and type are required.");
  }

  switch (type) {
    case "chat":
      return formatChatMessage(msgdata);
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
