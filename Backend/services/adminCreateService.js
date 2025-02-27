const User = require("../models/userModel");

exports.createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      const admin = new User({
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
      });

      await admin.save();
      console.log("Default admin account created.");
    } else {
      console.log("Admin account already exists.");
    }
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};
