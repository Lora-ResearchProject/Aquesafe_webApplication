import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { removeToken, getUserRole } from "../../utils/auth";
import {
  HiOutlineHome as HomeIcon,
  HiOutlineChatAlt as ChatAltIcon,
  HiOutlineLogout as LogoutIcon,
  HiOutlineMap as MapIcon,
  HiOutlineBell as BellIcon,
  HiOutlineDatabase as DatabaseIcon,
  HiOutlineKey as KeyIcon,
  HiOutlineLocationMarker as LocationMarkerIcon,
  HiOutlineCollection as CollectionIcon,
  HiOutlineSwitchHorizontal as DataPipelineIcon,
} from "react-icons/hi";

const Sidebar = ({ isAdmin }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const userRole = getUserRole();

  const handleLogout = () => {
    removeToken();
    navigate("/");
  };

  return (
    <>
      <div
        className={`bg-white h-full shadow-lg transition-transform duration-300 fixed md:relative md:translate-x-0 w-48`}
      >
        {/* Navigation Links */}
        <ul className="space-y-4 mt-6">
          <NavItem to="/dashboard" icon={HomeIcon} label="Dashboard" />
          <NavItem to="/sos" icon={BellIcon} label="SOS Alerts" />
          <NavItem to="/chat" icon={ChatAltIcon} label="Chat" />
          <NavItem to="/tracker" icon={LocationMarkerIcon} label="Tracker" />
          <NavItem to="/routelog" icon={MapIcon} label="Route Log" />
          <NavItem to="/gateway-page" icon={CollectionIcon} label="GateWays" />
          {userRole === "admin" && (
            <div className="mt-6 border-t border-gray-200 pt-4 space-y-4">
              <p className="text-xs text-gray-400 uppercase font-semibold px-4 mb-2 text-center ">
                Admin Section
              </p>

              <NavItem
                to="/dataPipeLine"
                icon={DataPipelineIcon}
                label="Data Pipeline"
              />
              <NavItem
                to="/admin-dashboard"
                icon={KeyIcon}
                label="User Panel"
              />
              <NavItem
                to="/messageData"
                icon={DatabaseIcon}
                label="Message DB"
              />
            </div>
          )}
        </ul>

        {/* Logout Button */}
        <div className="absolute bottom-4 w-full flex justify-center">
          <button
            className="w-5/6 flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setShowModal(true)}
          >
            <LogoutIcon className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-lg font-bold">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-200 text-black px-4 py-2 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Navigation Item Component
 */
const NavItem = ({ to, icon: Icon, label }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center px-4 py-2 mx-3 transition-colors duration-200 rounded-lg ${
            isActive
              ? "bg-blue-100 text-blue-600 "
              : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
          }`
        }
      >
        <Icon className="h-5 w-5 mr-3" />
        {label}
      </NavLink>
    </li>
  );
};

export default Sidebar;
