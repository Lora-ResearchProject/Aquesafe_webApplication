import React, {useState, useEffect} from "react";
import {
  getAllVesselLocationsdirect,
  fetchLatestVesselLocations,
} from "../services/locationService";

const TestingPage = () => {
  // State for the first function
  const [allLocationsData, setAllLocationsData] = useState(null);
  const [allLocationsError, setAllLocationsError] = useState(null);
  const [allLocationsLoading, setAllLocationsLoading] = useState(true);

  // State for the second function
  const [latestLocationsData, setLatestLocationsData] = useState(null);
  const [latestLocationsError, setLatestLocationsError] = useState(null);
  const [latestLocationsLoading, setLatestLocationsLoading] = useState(true);

  // Fetch data for the first function
  useEffect(() => {
    const fetchAllLocations = async () => {
      try {
        const response = await getAllVesselLocationsdirect();
        setAllLocationsData(response);
      } catch (err) {
        setAllLocationsError(err.message || "An unexpected error occurred.");
      } finally {
        setAllLocationsLoading(false);
      }
    };

    fetchAllLocations();
  }, []);

  // Fetch data for the second function
  useEffect(() => {
    const fetchLatestLocations = async () => {
      try {
        const response = await fetchLatestVesselLocations();
        setLatestLocationsData(response);
      } catch (err) {
        setLatestLocationsError(err.message || "An unexpected error occurred.");
      } finally {
        setLatestLocationsLoading(false);
      }
    };

    fetchLatestLocations();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Testing Page
      </h1>
      <h2 className="text-xl text-center text-gray-600 mb-8">
        This page was modified for testing purposes
      </h2>

      {/* Section for all vessel locations */}
      <div className="mb-8 bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Vessel Locations (Direct)
        </h2>
        {allLocationsLoading ? (
          <div className="text-blue-600">Loading vessel locations...</div>
        ) : allLocationsError ? (
          <div className="text-red-600">Error: {allLocationsError}</div>
        ) : allLocationsData && allLocationsData.length > 0 ? (
          <ul className="list-disc list-inside space-y-2">
            {allLocationsData.map((location, index) => (
              <li key={index} className="text-gray-700">
                {JSON.stringify(location)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No Data available.</p>
        )}
      </div>

      {/* Section for latest vessel locations */}
      <div className="mb-8 bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Vessel Locations (Through Node Backend)
        </h2>
        {latestLocationsLoading ? (
          <div className="text-blue-600">Loading vessel locations...</div>
        ) : latestLocationsError ? (
          <div className="text-red-600">Error: {latestLocationsError}</div>
        ) : latestLocationsData && latestLocationsData.length > 0 ? (
          <ul className="list-disc list-inside space-y-2">
            {latestLocationsData.map((location, index) => (
              <li key={index} className="text-gray-700">
                {JSON.stringify(location)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No Data available.</p>
        )}
      </div>
    </div>
  );
};

export default TestingPage;

{
  /* <div className="flex flex-col justify-evenly items-center h-full bg-gray-100 p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">Route Log Page</h1>
      </div>

      <div className="text-center">
        <p className="text-3xl text-gray-600">
          This page is currently under construction. We are working hard to
          bring you an amazing experience!
        </p>
      </div>

      <div className="text-center">
        <p className="text-base text-gray-500">Stay tuned!</p>
      </div>
    </div> */
}
