const Gateway = require("../models/gatewayModel");

// Get all gateways (already provided)
exports.getGateways = async (req, res) => {
  try {
    const gateways = await Gateway.find();
    res.status(200).json(gateways);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gateways", error });
  }
};

// Get a single gateway by ID
exports.getGatewayById = async (req, res) => {
  try {
    const gateway = await Gateway.findById(req.params.id);
    if (!gateway) {
      return res.status(404).json({ message: "Gateway not found" });
    }
    res.status(200).json(gateway);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gateway", error });
  }
};

// Create a new gateway (already provided)
exports.createGateway = async (req, res) => {
  const { gatewayId, gatewayName, lat, lng, status } = req.body;

  // Validate input data
  if (!gatewayId || !gatewayName || lat == null || lng == null || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newGateway = new Gateway({
      gatewayId,
      gatewayName,
      lat,
      lng,
      status,
    });
    await newGateway.save();
    res.status(201).json(newGateway);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Gateway ID must be unique", error });
    } else {
      res.status(500).json({ message: "Error creating gateway", error });
    }
  }
};

// Update a gateway
exports.updateGateway = async (req, res) => {
  const { gatewayId, gatewayName, lat, lng, status } = req.body;

  try {
    const gateway = await Gateway.findById(req.params.id);
    if (!gateway) {
      return res.status(404).json({ message: "Gateway not found" });
    }

    // Update only the fields that are provided in the request
    if (gatewayId) gateway.gatewayId = gatewayId;
    if (gatewayName) gateway.gatewayName = gatewayName;
    if (lat != null) gateway.lat = lat;
    if (lng != null) gateway.lng = lng;
    if (status) gateway.status = status;

    await gateway.save();
    res.status(200).json(gateway);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Gateway ID must be unique", error });
    } else {
      res.status(500).json({ message: "Error updating gateway", error });
    }
  }
};

// Delete a gateway
exports.deleteGateway = async (req, res) => {
  try {
    const gateway = await Gateway.findByIdAndDelete(req.params.id);
    if (!gateway) {
      return res.status(404).json({ message: "Gateway not found" });
    }
    res.status(200).json({ message: "Gateway deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting gateway", error });
  }
};
