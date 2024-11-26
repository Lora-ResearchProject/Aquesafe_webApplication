import React from "react";
import MapContainer from "../Map/MapContainer";

const TrackerMap = ({ locations, selectedLocation, setSelectedLocation }) => {
  return (
    <div className="w-3/4">
      <MapContainer
        locations={locations}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />
    </div>
  );
};

export default TrackerMap;
