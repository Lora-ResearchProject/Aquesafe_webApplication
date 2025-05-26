import React, { useState, useEffect } from "react";
import {
  fetchLatestVesselLocations,
  fetchVessels,
} from "../services/locationService";
import WeatherFinder from "../Components/weather/WeatherFinder";
import dayjs from "dayjs";

const VesselPage = () => {
  const [vessels, setVessels] = useState([]);
  const [latestLocations, setLatestLocations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVessels = async () => {
      try {
        const vesselData = await fetchVessels();
        setVessels(vesselData);

        // Fetch latest locations
        const locationData = await fetchLatestVesselLocations();
        const locationMap = locationData.reduce((acc, loc) => {
          acc[loc.vesselId] = loc; // Store latest location by vesselId
          return acc;
        }, {});

        setLatestLocations(locationMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadVessels();
  }, []);

  // Format date-time function
  const formatDateTime = (dateTime) => {
  if (!dateTime) return "N/A";
  return dayjs(dateTime).format("YYYY-MM-DD"); // Keeps exact value
};

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Vessel Locations</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-white">
              <th className="py-2 px-4 border">Vessel ID</th>
              <th className="py-2 px-4 border">Vessel Name</th>
              <th className="py-2 px-4 border">Latitude</th>
              <th className="py-2 px-4 border">Longitude</th>
              <th className="py-2 px-4 border">Last Updated</th>
              <th className="py-2 px-4 border">Weather</th>
            </tr>
          </thead>
          <tbody>
            {vessels.map((vessel) => {
              const location = latestLocations[vessel.vesselId];
              return (
                <tr key={vessel.vesselId} className="text-center">
                  <td className="py-2 px-4 border">{vessel.vesselId}</td>
                  <td className="py-2 px-4 border">{vessel.vesselName}</td>
                  <td className="py-2 px-4 border">
                    {location ? location.lat : "N/A"}
                  </td>
                  <td className="py-2 px-4 border">
                    {location ? location.lng : "N/A"}
                  </td>
                  <td className="py-2 px-4 border">
                    {location ? formatDateTime(location.dateTime) : "No Data"}
                  </td>
                  <td className="py-2 px-4 border flex justify-center">
                    {location ? (
                      <WeatherFinder lat={location.lat} lon={location.lng} />
                    ) : (
                      "No Location"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VesselPage;
