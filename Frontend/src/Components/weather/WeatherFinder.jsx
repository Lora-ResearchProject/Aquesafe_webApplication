import React, { useState } from "react";
import axios from "axios";
import { baseURL } from "../../config/config";
import { FiCloudRain, FiX } from "react-icons/fi";

const API_BASE_URL = baseURL + "/api/weather-check";

const WeatherFinder = ({ lat, lon }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}`, {
        params: { lat, lon },
      });
      setWeatherData(response.data.rainPercentage);
    } catch (err) {
      setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    setIsPopupOpen(true);
    fetchWeather(); // Fetch weather data when opening the popup
  };

  return (
    <>
      {/* Weather Check Button */}
      <button
        onClick={handleButtonClick}
        className="bg-blue-500 text-white px-3 py-1 rounded flex items-center hover:bg-blue-600"
      >
        <FiCloudRain className="w-4 h-4 mr-2" /> {/* Rain Icon */}
        Check Weather
      </button>

      {/* Weather Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            {/* Close Button */}
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" /> {/* Close Icon */}
            </button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FiCloudRain className="w-6 h-6 text-blue-500" /> Weather
              Information
            </h2>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p>
                Rain Percentage:{" "}
                {weatherData !== null ? `${weatherData}%` : "Unknown"}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default WeatherFinder;
