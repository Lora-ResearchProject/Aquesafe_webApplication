import { useNavigate, useLocation } from "react-router-dom";
import { BellIcon, UserIcon } from "@heroicons/react/outline";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current route is `/profile`
  const isProfileActive = location.pathname === "/profile";

  return (
    <nav className="bg-white px-4 py-4 flex justify-between items-center shadow">
      {/* Logo */}
      <div className="py-0 px-4 border-none border-gray-200 flex justify-center items-center">
        <h2 className="text-blue-600 text-3xl font-bold">AquaSafe</h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <BellIcon className="h-6 w-6 text-gray-700 cursor-pointer" />
          <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">
            4
          </span>
        </div>
        <div
          className={`border-2 rounded-full p-1 ${
            isProfileActive ? "border-blue-600" : "border-gray-700"
          }`}
        >
          <UserIcon
            className={`h-6 w-6 cursor-pointer ${
              isProfileActive ? "text-blue-500" : "text-gray-700"
            }`}
            onClick={() => navigate("/profile")}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
