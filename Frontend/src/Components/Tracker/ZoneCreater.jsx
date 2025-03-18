import React, { useState } from "react";
import { createZone } from "../../services/zoneService";

const ZoneCreater = ({ onZoneCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [zoneName, setZoneName] = useState("");
  const [zoneType, setZoneType] = useState("normal"); // Default to "normal"
  const [boundary, setBoundary] = useState([{ lat: "", lng: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [zoneNameError, setZoneNameError] = useState("");

  // Handle zone name change (disallow spaces)
  const handleZoneNameChange = (e) => {
    const name = e.target.value;
    setZoneName(name);

    // Check if zone name has spaces
    if (/\s/.test(name)) {
      setZoneNameError("Zone name cannot contain spaces.");
    } else {
      setZoneNameError("");
    }
  };

  // Handle adding a new boundary coordinate
  const handleAddBoundary = () => {
    setBoundary([...boundary, { lat: "", lng: "" }]);
  };

  // Handle removing a boundary coordinate (excluding the first one)
  const handleRemoveBoundary = (index) => {
    if (boundary.length > 1) {
      const newBoundary = boundary.filter((_, i) => i !== index);
      setBoundary(newBoundary);
    }
  };

  // Handle changing boundary coordinates
  const handleBoundaryChange = (index, e) => {
    const { name, value } = e.target;
    const newBoundary = [...boundary];
    newBoundary[index][name] = value;
    setBoundary(newBoundary);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate coordinates
      const validCoordinates = boundary.every(
        (coord) => coord.lat && coord.lng
      );

      if (!validCoordinates) {
        setError("All coordinates must have both latitude and longitude.");
        setLoading(false);
        return;
      }

      await createZone({ name: zoneName, boundary, zoneType });
      setIsOpen(false);
      onZoneCreated(); // Notify parent component
    } catch (err) {
      setError("Failed to create zone. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
        onClick={() => setIsOpen(true)}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Zone"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          {/* Clickable Backdrop - closes popup when clicked */}
          <div
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Popup Content */}
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-96 z-20">
            <h2 className="text-lg font-semibold mb-4">Create a New Zone</h2>

            {error && <p className="text-red-500 mb-2">{error}</p>}
            {zoneNameError && (
              <p className="text-red-500 mb-2">{zoneNameError}</p>
            )}

            <form onSubmit={handleSubmit}>
              {/* Zone Name */}
              <label className="block mb-2">Zone Name:</label>
              <input
                type="text"
                className="border rounded p-2 w-full mb-3"
                value={zoneName}
                onChange={handleZoneNameChange}
                required
              />

              {/* Zone Type Selection */}
              <label className="block mb-2">Zone Type:</label>
              <select
                className="border rounded p-2 w-full mb-3 bg-white"
                value={zoneType}
                onChange={(e) => setZoneType(e.target.value)}
                required
              >
                <option value="normal">Normal</option>
                <option value="danger">Danger</option>
              </select>

              {/* Boundary Coordinates */}
              <label className="block mb-2">Boundary Coordinates:</label>
              {boundary.map((coord, index) => (
                <div key={index} className="flex space-x-3 mb-3">
                  <input
                    type="number"
                    className="border rounded p-2 w-1/2"
                    name="lat"
                    placeholder="Latitude"
                    value={coord.lat}
                    onChange={(e) => handleBoundaryChange(index, e)}
                    required
                  />
                  <input
                    type="number"
                    className="border rounded p-2 w-1/2"
                    name="lng"
                    placeholder="Longitude"
                    value={coord.lng}
                    onChange={(e) => handleBoundaryChange(index, e)}
                    required
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      className="text-red-500 ml-2"
                      onClick={() => handleRemoveBoundary(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="text-blue-500 mb-3"
                onClick={handleAddBoundary}
              >
                Add Another Coordinate
              </button>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  disabled={loading || zoneNameError}
                >
                  {loading ? "Saving..." : "Save Zone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoneCreater;
