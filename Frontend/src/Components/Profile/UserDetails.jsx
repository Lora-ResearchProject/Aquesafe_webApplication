// src/components/profile/UserDetails.js
import React, { useState } from "react";
import profileImage from "../../assets/icons/profileImage.png"; // Static profile image

const UserDetails = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await onUpdate(name, email);
      setMessage("Details updated successfully!");
      setTimeout(() => {
        setIsEditing(false);
        setMessage("");
      }, 2000); // Close popup after 2 seconds
    } catch (error) {
      setError(error.message || "Failed to update details. Please try again.");
    }
  };

  return (
    <div className="p-6 rounded-lg text-center">
      {/* Display User Details */}
      <div className="flex flex-col items-center">
        <img
          src={profileImage} // Fallback image
          alt="Profile"
          className="w-32 h-32 rounded-full mb-4 p-2 border-2 border-blue-600"
        />
        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        <button
          onClick={handleEditClick}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Edit Profile
        </button>
      </div>

      {/* Edit Popup */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit User Details</h2>
            {message && <p className="text-green-500 mb-4">{message}</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ml-4"
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ml-4"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;