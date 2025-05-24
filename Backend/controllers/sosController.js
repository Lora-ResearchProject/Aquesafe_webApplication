const Sos = require("../models/sosModel");
const { sendToGateway } = require("../services/outgoingMessageService");
const { formatoutgoingMessage } = require("../utils/outgoingMessageStructures");

// GET all SOS records
exports.getAllSos = async (req, res) => {
  try {
    const sosRecords = await Sos.find(); // Fetch all SOS records
    res.status(200).json(sosRecords);
  } catch (error) {
    console.error("Error fetching SOS records:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET SOS record by ID
exports.getSosById = async (req, res) => {
  try {
    const { id } = req.params; // Extract the SOS ID from request parameters
    const sosRecord = await Sos.findById(id);

    if (!sosRecord) {
      return res.status(404).json({ error: "SOS record not found" });
    }

    res.status(200).json(sosRecord);
  } catch (error) {
    console.error("Error fetching SOS record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET SOS records by vesselId
exports.getSosByVesselId = async (req, res) => {
  try {
    const { vesselId } = req.params; // Extract the vesselId from request parameters

    if (!vesselId) {
      return res.status(400).json({ error: "vesselId is required" });
    }

    // Find all SOS records that match the given vesselId
    const sosRecords = await Sos.find({ vesselId });

    if (sosRecords.length === 0) {
      return res
        .status(404)
        .json({ error: "No SOS records found for the given vesselId" });
    }

    res.status(200).json(sosRecords);
  } catch (error) {
    console.error("Error fetching SOS records:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PATCH function to update sosStatus
exports.updateSosStatus = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from request params
    const { sosStatus } = req.body; // Extract the new sosStatus from request body

    // Validate the sosStatus value
    if (!["active", "resolved"].includes(sosStatus)) {
      return res.status(400).json({ error: "Invalid sosStatus value" });
    }

    // Fetch the SOS record to retrieve sosId
    const sosRecord = await Sos.findById(id);

    if (!sosRecord) {
      return res.status(404).json({ error: "SOS record not found" });
    }

    // Update the SOS status
    const updatedSos = await Sos.findByIdAndUpdate(
      id,
      { sosStatus },
      { new: true } // Return the updated document
    );

    // Prepare and format the outgoing message
    const formattedMessage = formatoutgoingMessage(
      {
        vesselId: sosRecord.vesselId, // Use vesselId from the record
        sosId: sosRecord.sosId, // Include the retrieved sosId
        s: 2,
      },
      "sos" // Type of message
    );

    // Define the external server URL dynamically (or use environment variable)
    const externalServerUrl = process.env.GATEWAY_API_URL;

    // Send the formatted data to the external server
    // await sendToGateway(externalServerUrl, formattedMessage); // -------------------------------------------------------------- need to uncomment this after fix this

    res
      .status(200)
      .json({ message: "SOS status updated successfully", updatedSos });
  } catch (error) {
    console.error("Error updating SOS status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get SOS records by vesselId for the Mobile app
exports.getSosByVesselIdForMobile = async (req, res) => {
  try {
    const { vesselId } = req.params; // Get vesselId from request parameters

    if (!vesselId) {
      return res
        .status(400)
        .json({ success: false, error: "vesselId is required" });
    }

    // Fetch active alerts for the given vesselId
    const activeAlerts = await Sos.find({ vesselId, sosStatus: "active" }).sort(
      { dateTime: -1 }
    );

    // Fetch resolved alerts only if needed
    let resolvedAlerts = [];
    if (activeAlerts.length < 3) {
      resolvedAlerts = await Sos.find({ vesselId, sosStatus: "resolved" })
        .sort({ dateTime: -1 })
        .limit(3 - activeAlerts.length);
    }

    // Combine both, prioritizing active alerts
    const alertsToSend = [...activeAlerts, ...resolvedAlerts];

    // If no alerts found, return success: false
    if (alertsToSend.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No SOS alerts found for this vessel",
        count: 0,
        alerts: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "SOS alerts retrieved successfully",
      count: alertsToSend.length,
      alerts: alertsToSend,
    });
  } catch (error) {
    console.error("Error fetching SOS alerts:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
