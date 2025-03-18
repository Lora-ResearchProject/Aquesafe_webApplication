import React, { useState, useEffect } from "react";

const GatewayForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.gatewayId ||
      !formData.gatewayName ||
      formData.lat === "" ||
      formData.lng === "" ||
      !formData.status
    ) {
      alert("All fields are required");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">
        {initialData._id ? "Edit Gateway" : "Add Gateway"}
      </h2>
      <div>
        <label className="block text-sm font-medium">Gateway ID</label>
        <input
          type="text"
          name="gatewayId"
          value={formData.gatewayId}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="Enter Gateway ID"
          disabled={!!initialData._id} // Disable editing gatewayId for existing gateways
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Gateway Name</label>
        <input
          type="text"
          name="gatewayName"
          value={formData.gatewayName}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="Enter Gateway Name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Latitude</label>
        <input
          type="number"
          name="lat"
          value={formData.lat}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="Enter Latitude"
          step="any"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Longitude</label>
        <input
          type="number"
          name="lng"
          value={formData.lng}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="Enter Longitude"
          step="any"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Save
      </button>
    </form>
  );
};

export default GatewayForm;
