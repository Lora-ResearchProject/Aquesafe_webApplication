// src/pages/ForgotPasswordPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { forgotPassword } from "../services/authService";
import logo from "../assets/logos/logo.png";
import SpinnerIcon from "../Components/UI/SpinnerIcon";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); 

    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
      setTimeout(() => navigate("/"), 5000); 
    } catch (error) {
      setError(error.message || "Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-blue-100">
      <div className="absolute top-4 left-6">
        <img src={logo} alt="Logo" className="w-36" />
      </div>

      <div className="h-1/2 w-1/2 flex flex-col justify-evenly items-center">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mb-4">Forgot Your Password?</h2>
          <p className="text-gray-600 mb-4">
            Enter your registered email, and we'll send you a link to reset your
            password.
          </p>
        </div>

        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="w-80">
          <div className="flex items-center border rounded-lg p-2 bg-white">
            <FaEnvelope className="mr-2 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading} // Disable button while loading
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex justify-center items-center"
          >
            {isLoading ? (
              <div className="flex items-center">
                <SpinnerIcon />
                Sending...
              </div>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
        <Link to="/" className="mt-4 text-gray-600 hover:text-blue-600">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
