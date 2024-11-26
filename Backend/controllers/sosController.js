const Sos = require("../models/sosModel");

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

// PATCH function to update sosStatus
exports.updateSosStatus = async (req, res) => {
  try {
    const { id } = req.params; // Extract the SOS ID
    const { sosStatus } = req.body; // Extract the new sosStatus from request body

    // Validate the sosStatus value
    if (!["active", "resolved"].includes(sosStatus)) {
      return res.status(400).json({ error: "Invalid sosStatus value" });
    }

    const updatedSos = await Sos.findByIdAndUpdate(
      id,
      { sosStatus },
      { new: true } // Return the updated document
    );

    if (!updatedSos) {
      return res.status(404).json({ error: "SOS record not found" });
    }

    res
      .status(200)
      .json({ message: "SOS status updated successfully", updatedSos });
  } catch (error) {
    console.error("Error updating SOS status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
