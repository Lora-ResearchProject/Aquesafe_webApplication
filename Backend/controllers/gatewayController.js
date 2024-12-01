const Gateway = require("../models/gatewayModel");

// Get all gateways
exports.getGateways = async (req, res) => {
  try {
    const gateways = await Gateway.find();
    res.status(200).json(gateways);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gateways", error });
  }
};

// Create a new gateway
exports.createGateway = async (req, res) => {
  const { gatewayId, gatewayName, lat, lng } = req.body;

  // Validate input data
  if (!gatewayId || !gatewayName || lat == null || lng == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newGateway = new Gateway({ gatewayId, gatewayName, lat, lng });
    await newGateway.save();
    res.status(201).json(newGateway);
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error for unique fields
      res.status(400).json({ message: "Gateway ID must be unique", error });
    } else {
      res.status(500).json({ message: "Error creating gateway", error });
    }
  }
};
