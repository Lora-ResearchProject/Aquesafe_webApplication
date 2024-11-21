import { useState } from 'react';
import { BellIcon, UserIcon, MenuIcon } from '@heroicons/react/outline';

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-white px-4 py-2 flex justify-between items-center shadow">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4">
          <MenuIcon className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-blue-600">AquaSafe</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <BellIcon className="h-6 w-6 text-gray-700 cursor-pointer" />
          <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">4</span>
        </div>
        <UserIcon className="h-6 w-6 text-gray-700 cursor-pointer" />
      </div>
    </nav>
  );
};

export default Navbar;
