const { Server } = require("socket.io");

let io;

// Initialize WebSocket
const initWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:9000",
      methods: ["GET", "POST"],
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

module.exports = { initWebSocket, emitEvent };
