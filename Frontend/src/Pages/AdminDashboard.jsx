// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { fetchAllUsers, createUser, deleteUser } from "../services/authService";
import SpinnerIcon from "../Components/UI/SpinnerIcon";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showCreateUserPopup, setShowCreateUserPopup] = useState(false);

  // Fetch all users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userData = await fetchAllUsers();
        setUsers(userData);
      } catch (error) {
        setError(error.message || "Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Handle creating a new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true); // Start loading

    try {
      const createdUser = await createUser(newUser);
      setUsers([...users, createdUser.data]);
      setMessage(`User credentials sent to ${newUser.email} successfully!`);
      setNewUser({ name: "", email: "" }); // Clear form
      setShowCreateUserPopup(false); // Close popup
      setTimeout(() => setMessage(""), 10000); // Clear message after 10 seconds
    } catch (error) {
      setError(error.message || "Failed to create user.");
    } finally {
      setIsLoading(false); // Stop loading
    }
      
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        setUsers(users.filter((user) => user._id !== userId));
        setMessage("User deleted successfully!");
        setTimeout(() => setMessage(""), 10000); // Clear message after 10 seconds
      } catch (error) {
        setError(error.message || "Failed to delete user.");
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      {/* Header */}

      {/* Main Content */}
      <div className="w-full flex justify-end">
        {/* Create User Button */}
        <button
          onClick={() => setShowCreateUserPopup(true)}
          className="mb-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Create User
        </button>
      </div>
      {/* Create User Popup */}
      {showCreateUserPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateUserPopup(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <SpinnerIcon />
                      Creating...
                    </div>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div>
        <h2 className="text-xl font-bold mb-4">All Users</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={`user_${user._id}`} className="border-b">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">
                  {/* Only show Delete button if the user is not an admin */}
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition duration-300"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Success Message */}
      {message && (
        <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
          <div className="flex justify-between items-center">
            <p>{message}</p>
            <button
              onClick={() => setMessage("")}
              className="text-green-700 hover:text-green-900"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
