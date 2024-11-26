import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  ChatAltIcon,
  LogoutIcon,
  MapIcon,
  BellIcon,
  DatabaseIcon
} from "@heroicons/react/outline";

const Sidebar = ({ isOpen }) => {
  return (
    <div
      className={`bg-white h-full shadow-lg transition-transform duration-300 fixed md:relative md:translate-x-0 w-48`}
    >
      {/* Logo */}
      <div className="py-3 px-4 border-none border-gray-200 flex justify-center items-center">
        <h2 className="text-blue-600 text-2xl font-bold">AquaSafe</h2>
      </div>

      {/* Navigation Links */}
      <ul className="space-y-4 mt-6">
        <NavItem to="/dashboard" icon={HomeIcon} label="Dashboard" />
        <NavItem to="/sos" icon={BellIcon} label="SOS Alerts" />
        <NavItem to="/chat" icon={ChatAltIcon} label="Chat" />
        <NavItem to="/tracker" icon={MapIcon} label="Tracker" />
        <NavItem to="/route-log" icon={MapIcon} label="Route Log" />
        <NavItem to="/messageData" icon={DatabaseIcon} label="Message DB" />
        
      </ul>

      {/* Logout Button */}
      <div className="absolute bottom-4 w-full flex justify-center">
        <button className="w-5/6 flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg">
          <LogoutIcon className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
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
