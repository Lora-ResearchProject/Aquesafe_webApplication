import React from "react";
import MapContainer from "../Map/MapContainer";

const TrackerMap = ({
  locations,
  selectedLocation,
  setSelectedLocation,
  zones,
}) => {
  return (
    <div className="w-3/4 -z-0">
      <MapContainer
        locations={locations}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        zones={zones}
      />
    </div>
  );
};

export default TrackerMap;
