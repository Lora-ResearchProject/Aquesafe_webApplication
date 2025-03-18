const Zone = require("../models/Zone");
const { getFilteredVesselLocations } = require("../services/cerService");
const { isVesselInZone } = require("../utils/vesselZone");

// Create a new zone
exports.createZone = async (req, res) => {
  try {
    const { name, boundary, zoneType = "normal" } = req.body; // Default zoneType to "normal"
    const newZone = new Zone({ name, boundary, zoneType });
    const savedZone = await newZone.save();
    res.status(201).json(savedZone);
  } catch (error) {
    res.status(500).json({ error: "Failed to create zone: " + error.message });
  }
};

// Get all zones
exports.getAllZones = async (req, res) => {
  try {
    const zones = await Zone.find();
    res.status(200).json(zones);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve zones: " + error.message });
  }
};

// Get normal zones
exports.getNormalZones = async (req, res) => {
  try {
    const normalZones = await Zone.find({ zoneType: "normal" });
    res.status(200).json(normalZones);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve normal zones: " + error.message });
  }
};

// Get danger zones
exports.getDangerZones = async (req, res) => {
  try {
    const dangerZones = await Zone.find({ zoneType: "danger" });
    res.status(200).json(dangerZones);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve danger zones: " + error.message });
  }
};

// Get a single zone by id
exports.getZoneById = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id); // Use ID to find zone
    if (!zone) return res.status(404).json({ error: "Zone not found" });
    res.status(200).json(zone);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve zone: " + error.message });
  }
};

exports.updateZone = async (req, res) => {
  const { id } = req.params;

  const { name, boundary } = req.body;

  try {
    // 1. Validate Input
    if (!id || !name || !boundary) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!Array.isArray(boundary)) {
      return res.status(400).json({ message: "Boundary must be an array" });
    }

    for (const coord of boundary) {
      if (!coord.lat || !coord.lng) {
        return res
          .status(400)
          .json({ message: "Invalid boundary coordinates" });
      }
    }

    // 2. Check if the Zone Exists
    const existingZone = await Zone.findById(id);
    if (!existingZone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    // 3. Update the Zone
    existingZone.name = name;
    existingZone.boundary = boundary;

    const updatedZone = await existingZone.save();

    // 4. Return Success Response
    res.status(200).json({
      message: "Zone updated successfully",
      zone: updatedZone,
    });
  } catch (error) {
    // 5. Handle Errors
    console.error("Error updating zone:", error);
    res.status(500).json({ message: "Failed to update zone" });
  }
};

// Delete a zone by id
exports.deleteZone = async (req, res) => {
  try {
    const deletedZone = await Zone.findByIdAndDelete(req.params.id); // Use ID to delete zone

    if (!deletedZone) return res.status(404).json({ error: "Zone not found" });

    res.status(200).json({ message: "Zone deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete zone: " + error.message });
  }
};

// Get all vessels within a specified zone by id
exports.getVesselsByZone = async (req, res) => {
  try {
    const zoneId = req.params.zoneId; // Use zone ID
    const vessels = await getFilteredVesselLocations();

    if (zoneId === "all") {
      return res.status(200).json(vessels); // Return all vessels
    }

    const zone = await Zone.findById(zoneId); // Find zone by ID

    if (!zone) {
      return res.status(404).json({ error: "Zone not found" });
    }

    const filteredVessels = vessels.filter((vessel) =>
      isVesselInZone(vessel, zone)
    );

    res.status(200).json(filteredVessels);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve vessels by zone: " + error.message });
  }
};
