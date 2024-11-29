// Function to format data based on type
function formatoutgoingMessage(msgdata, type) {
    if (!msgdata || !type) {
        throw new Error("message data and type are required.");
    }

    switch (type) {
        case "chat":
            return formatChatMessage(msgdata);

        // Future case for other types can be added here
        default:
            throw new Error(`Unsupported type: ${type}`);
    }
}

// Helper function to format chat message
function formatChatMessage(msgdata) {
    const { vessleId, messageId, messageNumber } = msgdata;

    if (!vessleId || !messageId || !messageNumber) {
        throw new Error("message data must include vessleId, messageId, and messageNumber.");
    }

    return {
        id: `${vessleId}|${messageId}`,
        m: messageNumber,
    };
}

module.exports = { formatoutgoingMessage };
