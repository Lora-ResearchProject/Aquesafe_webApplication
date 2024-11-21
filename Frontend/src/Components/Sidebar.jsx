import { HomeIcon, ChatAltIcon, LogoutIcon, MapIcon, BellIcon } from '@heroicons/react/outline';

const Sidebar = ({ isOpen }) => {
  return (
    <div
      className={`bg-white h-full shadow-lg transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed md:relative md:translate-x-0`}
    >
      <div className="py-4 px-4">
        <h2 className="text-blue-600 text-2xl font-bold">AquaSafe</h2>
      </div>
      <ul className="space-y-4">
        <li className="flex items-center px-4 py-2 hover:bg-gray-100">
          <HomeIcon className="h-5 w-5 mr-3 text-blue-600" />
          Dashboard
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-100">
          <BellIcon className="h-5 w-5 mr-3 text-blue-600" />
          SOS Alerts
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-100">
          <ChatAltIcon className="h-5 w-5 mr-3 text-blue-600" />
          Chat
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-100">
          <MapIcon className="h-5 w-5 mr-3 text-blue-600" />
          Tracker
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-100">
          <MapIcon className="h-5 w-5 mr-3 text-blue-600" />
          Route Log
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-100 text-red-600">
          <LogoutIcon className="h-5 w-5 mr-3" />
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
