const { Server } = require("socket.io");

let io;

// Initialize WebSocket
const initWebSocket = (server) => {
  const fURL = process.env.FRONTEND_BASE_URL;
  io = new Server(server, {
    cors: {
      origin: fURL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

// Emit events to clients
const emitEvent = (eventName, data) => {
  if (io) {
    io.emit(eventName, data);
  }
};

// emitEvent("sos_created", savedSos);
// emitEvent("new_chat", savedChat);
// emitEvent("new_notification", savedNotification);

module.exports = { initWebSocket, emitEvent };
