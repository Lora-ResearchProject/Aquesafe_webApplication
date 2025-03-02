import React, { useState, useEffect } from "react";

const ChangePassword = ({ onChangePassword }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Clear form and messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      await onChangePassword(currentPassword, newPassword);
      setMessage("Password changed successfully!");
    } catch (error) {
      setError(error.message || "Failed to change password. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6 w-1/2">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col justify-evenly items-center">
          {/* Current Password */}
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-1/2 p-2 border rounded-lg my-3"
            required
            placeholder="Current Password"
          />

          {/* New Password */}
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-1/2 p-2 border rounded-lg my-3"
            required
            placeholder="New Password"
          />

          {/* Confirm New Password */}
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-1/2 p-2 border rounded-lg my-3"
            required
            placeholder="Confirm New Password"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-1/3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mt-4"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
