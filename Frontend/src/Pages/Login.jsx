// src/pages/LoginPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { login } from "../services/authService";
import logo from "../assets/logos/logo.png";
import background from "../assets/backgroundImage/loginBg.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login(email, password);
      console.log("Login successful:", response);

      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="absolute top-4 left-6">
        <img src={logo} alt="Logo" className="w-36" />
      </div>
      <div className="w-1/2 bg-blue-100 flex justify-center items-center">
        <div className="h-1/2 w-1/2 flex flex-col justify-evenly items-center">
          <h2 className="text-3xl font-bold">Welcome Back!</h2>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="w-80">
            <div className="flex items-center border rounded-lg p-2 mb-5 bg-white">
              <FaUser className="mr-2 text-gray-500" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none"
                required
              />
            </div>
            <div className="flex items-center border rounded-lg p-2 mb-4 bg-white">
              <FaLock className="mr-2 text-gray-500" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none"
                required
              />
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-gray-600 inline-block hover:text-blue-600 w-full text-end pr-2"
            >
              Forgot password
            </Link>
            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <div
        className="w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      ></div>
    </div>
  );
};

export default LoginPage;
