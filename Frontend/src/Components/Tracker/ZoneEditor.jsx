import React, { useState } from "react";
import { updateZone } from "../../services/zoneService";

const ZoneEditor = ({ zone, onZoneUpdated, onClose }) => {
  const [zoneName, setZoneName] = useState(zone.name);
  const [boundary, setBoundary] = useState(zone.boundary);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [zoneNameError, setZoneNameError] = useState("");

  const handleZoneNameChange = (e) => {
    const name = e.target.value;
    setZoneName(name);

    if (/\s/.test(name)) {
      setZoneNameError("Zone name cannot contain spaces.");
    } else {
      setZoneNameError("");
    }
  };

  const handleAddBoundary = () => {
    setBoundary([...boundary, { lat: "", lng: "" }]);
  };

  const handleRemoveBoundary = (index) => {
    if (boundary.length > 1) {
      const newBoundary = boundary.filter((_, i) => i !== index);
      setBoundary(newBoundary);
    }
  };

  const handleBoundaryChange = (index, e) => {
    const { name, value } = e.target;
    const newBoundary = [...boundary];
    newBoundary[index][name] = value;
    setBoundary(newBoundary);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const validCoordinates = boundary.every(
        (coord) => coord.lat && coord.lng
      );

      if (!validCoordinates) {
        setError("All coordinates must have both latitude and longitude.");
        setLoading(false);
        return;
      }

      await updateZone(zone._id, { name: zoneName, boundary });
      onZoneUpdated(); // Notify parent component
      onClose(); // Close the modal
    } catch (err) {
      setError("Failed to update zone. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-96 z-20">
        <h2 className="text-lg font-semibold mb-4">Edit Zone</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {zoneNameError && <p className="text-red-500 mb-2">{zoneNameError}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Zone Name:</label>
          <input
            type="text"
            className="border rounded p-2 w-full mb-3"
            value={zoneName}
            onChange={handleZoneNameChange}
            required
          />

          <label className="block mb-2">Boundary Coordinates:</label>
          {boundary.map((coord, index) => (
            <div key={`z2-${index}`} className="flex space-x-3 mb-3">
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

          <div className="flex justify-between">
            <button
              type="button"
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={loading || zoneNameError}
            >
              {loading ? "Updating..." : "Update Zone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ZoneEditor;
