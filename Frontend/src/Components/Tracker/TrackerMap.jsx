import React from "react";
import MapContainer from "../Map/MapContainer";
import Spinner from "../UI/Spinner"; // Adjust the import path as needed

const TrackerMap = ({
  vesselData,
  gatewayData,
  zoneData,
  hotspotData,
  selectedLocation,
  setSelectedLocation,
}) => {
  const isLoading =
    vesselData.loading ||
    gatewayData.loading ||
    zoneData.loading ||
    hotspotData.loading;

  return (
    <div className="w-3/4 relative -z-0">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <Spinner />
        </div>
      )}
      <MapContainer
        locations={[...vesselData.locations, ...gatewayData.locations]}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        zones={zoneData.zones}
        hotspots={hotspotData.hotspots}
      />
    </div>
  );
};

export default TrackerMap;
