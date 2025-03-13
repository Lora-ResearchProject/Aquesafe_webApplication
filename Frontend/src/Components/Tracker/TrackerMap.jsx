import React from "react";
import MapContainer from "../Map/MapContainer";

const TrackerMap = ({
  locations,
  selectedLocation,
  setSelectedLocation,
  zones,
  hotspots,
}) => {
  return (
    <div className="w-3/4 -z-0">
      <MapContainer
        locations={locations}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        zones={zones}
        hotspots={hotspots}
      />
    </div>
  );
};

export default TrackerMap;
