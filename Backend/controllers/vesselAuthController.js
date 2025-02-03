const Vessel = require("../models/vesselModel");

// Register a new vessel
exports.registerVessel = async (req, res) => {
  const { vesselName, email, password } = req.body;

  try {
    // Check if the vessel already exists by email
    const vesselExists = await Vessel.findOne({ email });

    if (vesselExists) {
      return res.status(400).json({ message: "This Vessel already exists" });
    }

    // Find the highest vesselId and increment it
    const lastVessel = await Vessel.findOne().sort({ vesselId: -1 }).exec();
    let newVesselId;

    if (lastVessel) {
      // Increment the vesselId and ensure it's 3 digits with leading zeros
      newVesselId = (parseInt(lastVessel.vesselId) + 1)
        .toString()
        .padStart(3, "0");
    } else {
      // Start with "001" if no vessels exist
      newVesselId = "001";
    }

    // Create the new vessel
    const vessel = await Vessel.create({
      vesselName,
      email,
      password,
      vesselId: newVesselId,
    });

    if (vessel) {
      res.status(201).json({ message: "Vessel registered successfully" });
    } else {
      res.status(400).json({ message: "Invalid vessel data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login Vessel
exports.loginVessel = async (req, res) => {
  const { email, password } = req.body;

  try {
    const vessel = await Vessel.findOne({ email });

    if (vessel && (await vessel.matchPassword(password))) {
      res.json({
        vesselId: vessel.vesselId,
        message: "Login successful",
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all vessel details
exports.getAllVessels = async (req, res) => {
  try {
    
    const vessels = await Vessel.find({}, 'vesselId vesselName');

    res.status(200).json({
      success: true,
      data: vessels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get vessel details using vesselId
exports.getVesselDetailsById = async (req, res) => {
  const { vesselId } = req.params;
  try {
    const vessel = await Vessel.findOne({ vesselId }).select("-_id -password");
    if (!vessel) {
      return res.status(404).json({ message: "Vessel not found" });
    }
    res.status(200).json(vessel);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Edit vessel details (without password)
exports.editVesselDetails = async (req, res) => {
  const { vesselId } = req.params;
  const { vesselName, email } = req.body;
  try {
    const updatedVessel = await Vessel.findOneAndUpdate(
      { vesselId },
      { vesselName, email },
      { new: true, runValidators: true, fields: "-password" }
    );
    if (!updatedVessel) {
      return res.status(404).json({ message: "Vessel not found" });
    }
    res.status(200).json({ message: "Vessel updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  const { vesselId } = req.params;
  const { oldPassword, newPassword } = req.body;
  try {
    const vessel = await Vessel.findOne({ vesselId });
    if (!vessel) {
      return res.status(404).json({ message: "Vessel not found" });
    }

    const isMatch = await vessel.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    vessel.password = newPassword;
    await vessel.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
