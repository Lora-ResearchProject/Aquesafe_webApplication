import React from "react";

const Sidebar = ({
  locations,
  searchTerm,
  setSearchTerm,
  selectedLocation,
  setSelectedLocation,
}) => {
  return (
    <div className="w-1/4 bg-gray-100 p-4 border-none border-gray-300">
      <input
        type="text"
        placeholder="Search..."
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="space-y-2">
        {locations
          .filter((location) =>
            location.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((location) => (
            <div
              key={location.id}
              onClick={() => setSelectedLocation(location)}
              className={`p-3 rounded-lg cursor-pointer border ${
                selectedLocation?.id === location.id
                  ? "bg-blue-100 border-blue-300"
                  : "bg-white border-gray-300"
              } hover:bg-blue-50`}
            >
              <strong className="block text-lg font-medium text-gray-800">
                {location.name}
              </strong>
              <p className="text-sm text-gray-600">
                {location.lat.toFixed(3)}N, {location.lng.toFixed(3)}W
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
