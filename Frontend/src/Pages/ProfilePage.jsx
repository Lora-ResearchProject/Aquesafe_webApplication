import React, { useEffect, useState } from "react";
import {
  fetchUserDetails,
  updateUserDetails,
  changePassword,
} from "../services/authService";
import UserDetails from "../Components/Profile/UserDetails";
import ChangePassword from "../Components/Profile/ChangePassword";

const ProfilePage = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  // Fetch user details on component mount
  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const userData = await fetchUserDetails();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserDetails();
  }, []);

  // Handle updating user details
  const handleUpdateDetails = async (name, email) => {
    const updatedUser = await updateUserDetails(name, email);
    setUser({name, email});
  };

  // Handle changing password
  const handleChangePassword = async (currentPassword, newPassword) => {
    await changePassword(currentPassword, newPassword);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-full p-5 flex flex-col justify-start items-center">

      <UserDetails user={user} onUpdate={handleUpdateDetails} />

      <ChangePassword onChangePassword={handleChangePassword} />
    </div>
  );
};

export default ProfilePage;
