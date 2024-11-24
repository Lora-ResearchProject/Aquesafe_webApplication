const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const vesselTrackerRoutes = require("./routes/vesselTrackerRoutes");
const incommingMessageRoutes = require("./routes/incommingMessageRoutes");
const vesselAuthRoutes = require("./routes/vesselAuthRoutes");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

module.exports = app;
