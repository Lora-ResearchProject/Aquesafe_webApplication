const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { initWebSocket } = require("./services/websocket");

const userRoutes = require("./routes/userRoutes");
const vesselTrackerRoutes = require("./routes/vesselTrackerRoutes");
const incommingMessageRoutes = require("./routes/incommingMessageRoutes");
const vesselAuthRoutes = require("./routes/vesselAuthRoutes");
const messageDataRoutes = require("./routes/messageDataRoutes");
const sosRoutes = require("./routes/sosRoutes");
const gatewayRoutes = require("./routes/gatewayRoutes");
const chatRoutes = require("./routes/chatRoutes");
const vesselRouteLogRoutes = require("./routes/vesselRouteLogRoutes");
const fishingHotspotsRoutes = require("./routes/fishingHotspotsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const zoneRoutes = require("./routes/zoneRoutes");

const testRoutes = require("./routes/testRoutes");
const { generateId } = require("./utils/idGenerator");
const { startProximityAlertChecks } = require("./services/proximityAlertService");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const server = http.createServer(app);

// Initialize WebSocket
initWebSocket(server);

//-------------------
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});
//-------------------

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tracker", vesselTrackerRoutes);
app.use("/api/server", incommingMessageRoutes);
app.use("/api/vessel-auth", vesselAuthRoutes);
app.use("/api/messageData", messageDataRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/gateway", gatewayRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/test", testRoutes);
app.use("/api/route-log", vesselRouteLogRoutes);
app.use("/api/hotspots", fishingHotspotsRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/zones", zoneRoutes);

// generateId();
// console.log("🚀 ~ generateId():", generateId());

// Start proximity alert checks
startProximityAlertChecks();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

module.exports = server;
