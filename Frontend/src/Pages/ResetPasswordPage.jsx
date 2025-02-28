// src/pages/ResetPasswordPage.js
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { resetPassword } from "../services/authService";
import logo from "../assets/logos/logo.png";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await resetPassword(resetToken, newPassword);
      setMessage(response.message);
      setTimeout(() => navigate("/"), 5000);
    } catch (error) {
      setError(error.message || "Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-blue-100">
      <div className="absolute top-4 left-6">
        <img src={logo} alt="Logo" className="w-36" />
      </div>

      <div className="h-1/2 w-1/2 flex flex-col justify-evenly items-center">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>
          <p className="text-gray-600 mb-4">
            Create a new password for your account
          </p>
        </div>

        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="w-80">
          <div className="flex items-center border rounded-lg p-2 bg-white mb-3">
            <FaLock className="mr-2 text-gray-500" />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full outline-none"
              required
            />
          </div>
          <div className="flex items-center border rounded-lg p-2 bg-white">
            <FaLock className="mr-2 text-gray-500" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Reset Password
          </button>
        </form>
        <Link to="/" className="mt-4 text-gray-600 hover:text-blue-600">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
