import React, { useState, useEffect } from "react";
import {
  deleteGateway,
  updateGateway,
  createGateway,
  fetchGateways,
} from "../services/gatewayService"; // Assuming fetchGateways is renamed to getGateways
import GatewayForm from "../Components/gateway/GatewayForm";
import GatewayPopup from "../Components/gateway/GatewayPopup";
import WeatherFinder from "../Components/weather/WeatherFinder";
import { getUserRole } from "../utils/auth";

const GatewayPage = () => {
  const [gateways, setGateways] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const userRole = getUserRole();

  // Fetch gateways on mount
  useEffect(() => {
    const fetchGatewaydata = async () => {
      try {
        const data = await fetchGateways();
        setGateways(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchGatewaydata();
  }, []);

  // Open modal for creating a new gateway
  const handleCreate = () => {
    // Find the highest gatewayId and increment it
    const maxId = gateways.length
      ? Math.max(...gateways.map((g) => parseInt(g.gatewayId, 10)))
      : 0;
    setSelectedGateway({
      gatewayId: (maxId + 1).toString(),
      gatewayName: "",
      lat: "",
      lng: "",
      status: "Active", // Default status
    });
    setIsModalOpen(true);
  };

  // Open modal for editing a gateway
  const handleEdit = (gateway) => {
    setSelectedGateway(gateway);
    setIsModalOpen(true);
  };

  // Delete a gateway
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this gateway?")) {
      try {
        await deleteGateway(id);
        setGateways(gateways.filter((gateway) => gateway._id !== id));
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle form submission for create/update
  const handleSubmit = async (formData) => {
    try {
      if (selectedGateway && selectedGateway._id) {
        // Update existing gateway
        const updatedGateway = await updateGateway(
          selectedGateway._id,
          formData
        );
        setGateways(
          gateways.map((gateway) =>
            gateway._id === updatedGateway._id ? updatedGateway : gateway
          )
        );
      } else {
        // Create new gateway
        const newGateway = await createGateway(formData);
        setGateways([...gateways, newGateway]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  //   if (error) {
  //     return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  //   }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mt-5">
        <h1 className="text-2xl font-bold mb-4">Gateways</h1>
        {userRole === "admin" && (
          <button
            onClick={handleCreate}
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add New Gateway
          </button>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-center my-5">Error: {error}</div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Gateway ID</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Location</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {gateways.map((gateway) => (
              <tr key={gateway._id} className="text-center">
                <td className="py-2 px-4 border">{gateway.gatewayId}</td>
                <td className="py-2 px-4 border">{gateway.gatewayName}</td>
                <td className="py-2 px-4 border">{`${gateway.lat}, ${gateway.lng}`}</td>
                <td className="py-2 px-4 border">{gateway.status}</td>
                <td className="py-2 px-4 border">
                  <div className="flex justify-evenly items-center">
                    <WeatherFinder lat={gateway.lat} lon={gateway.lng} />
                    {userRole === "admin" && (
                      <>
                        <button
                          onClick={() => handleEdit(gateway)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(gateway._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <GatewayPopup
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <GatewayForm initialData={selectedGateway} onSubmit={handleSubmit} />
        </GatewayPopup>
      )}
    </div>
  );
};

export default GatewayPage;
