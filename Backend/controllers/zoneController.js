const Zone = require("../models/Zone");
const { getFilteredVesselLocations } = require("../services/cerService");
const { isVesselInZone } = require("../utils/vesselZone");

// Create a new zone
exports.createZone = async (req, res) => {
  try {
    const { name, boundary } = req.body;
    const newZone = new Zone({ name, boundary });
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

// Get a single zone by name
exports.getZoneByName = async (req, res) => {
  try {
    const zone = await Zone.findOne({ name: req.params.name });
    if (!zone) return res.status(404).json({ error: "Zone not found" });
    res.status(200).json(zone);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve zone: " + error.message });
  }
};

// Update a zone
exports.updateZone = async (req, res) => {
  try {
    const updatedZone = await Zone.findOneAndUpdate(
      { name: req.params.name },
      { boundary: req.body.boundary },
      { new: true }
    );

    if (!updatedZone) return res.status(404).json({ error: "Zone not found" });

    res.status(200).json(updatedZone);
  } catch (error) {
    res.status(500).json({ error: "Failed to update zone: " + error.message });
  }
};

// Delete a zone
exports.deleteZone = async (req, res) => {
  try {
    const deletedZone = await Zone.findOneAndDelete({ name: req.params.name });

    if (!deletedZone) return res.status(404).json({ error: "Zone not found" });

    res.status(200).json({ message: "Zone deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete zone: " + error.message });
  }
};

// Get all vessels within a specified zone
exports.getVesselsByZone = async (req, res) => {
  try {
    const zoneName = req.params.zoneName;
    const vessels = await getFilteredVesselLocations();

    if (zoneName.toLowerCase() === "all") {
      return res.status(200).json(vessels); // Return all vessels
    }

    const zone = await Zone.findOne({ name: zoneName });

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
