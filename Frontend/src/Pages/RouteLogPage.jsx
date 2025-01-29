import React, { useState, useEffect } from "react";
import {
  fetchVessels,
  fetchVesselLocations,
} from "../services/locationService";
import MapContainer from "../Components/RouteLog/RLMapContainer";
import { Button } from "../Components/UI/button";
import { Select, SelectItem } from "../Components/UI/select";
import { CustomDatePicker } from "../Components/UI/date-picker";
import { Loader } from "../Components/UI/loader";

const RouteLogPage = () => {
  const [vessels, setVessels] = useState([]);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingLocations, setFetchingLocations] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVessels = async () => {
      setLoading(true);
      const data = await fetchVessels();
      setVessels(data);
      setLoading(false);
    };
    loadVessels();
  }, []);

  const handleFetchLocations = async () => {
    if (!selectedVessel) {
      setError("Please select a vessel");
      return;
    }
    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }
    setError(null);
    setFetchingLocations(true);

    const response = await fetchVesselLocations(selectedVessel, selectedDate);

    if (response.error) {
      setError(response.error);
      setLocations([]);
    } else {
      setLocations(response.data);
    }

    setFetchingLocations(false);
  };

  const handleReset = () => {
    setSelectedVessel(null);
    setSelectedDate(new Date());
    setLocations([]);
    setError(null);
  };

  return (
    <div className="h-screen w-full p-4 flex flex-row">
      {/* Left Section (Map) */}
      <div className="flex-grow">
        <MapContainer locations={locations} />
      </div>

      {/* Right Section (Dropdowns, Date Picker, Button) */}
      <div className="w-1/4 flex flex-col gap-4 pl-4 py-4">
        <div>
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader />
              <span className="ml-2">Loading vessels...</span>
            </div>
          ) : (
            <Select
              onValueChange={setSelectedVessel}
              disabled={loading}
              value={selectedVessel || ""}
              className="w-full"
            >
              <SelectItem value="" disabled>
                Select a vessel
              </SelectItem>

              {vessels.map((vessel) => (
                <SelectItem key={vessel.vesselId} value={vessel.vesselId}>
                  {vessel.vesselName}
                </SelectItem>
              ))}
            </Select>
          )}
        </div>

        <div>
          <CustomDatePicker
            selectedDate={selectedDate}
            onChange={setSelectedDate}
          />
        </div>
        <div className="h-fit">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>

        <Button onClick={handleFetchLocations} disabled={fetchingLocations}>
          {fetchingLocations ? <Loader /> : "Fetch Locations"}
        </Button>

        <Button
          onClick={handleReset}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default RouteLogPage;
