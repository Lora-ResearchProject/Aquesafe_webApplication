import React from "react";
import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Circle,
} from "react-leaflet";
import FlyToMarker from "./FlyToMarker";
import MarkerIcon from "./MarkerIcon";

const defaultCenter = [7.8731, 80.7718];

const MapContainer = ({
  locations,
  selectedLocation,
  setSelectedLocation,
  zones,
  hotspots,
}) => {
  return (
    <LeafletMap
      center={defaultCenter}
      zoom={8}
      className="h-full w-full rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />

      {/* Render Zones as Polygons */}
      {zones &&
        zones.map((zone, index) => {
          const coordinates = zone.boundary.map((coord) => [
            parseFloat(coord.lat),
            parseFloat(coord.lng),
          ]);

          // Assign colors based on zone type
          const zoneColors =
            zone.zoneType === "danger"
              ? { border: "red", fill: "rgba(255, 0, 0, 0.5)" } // Red for danger zones
              : { border: "blue", fill: "rgba(0, 0, 255, 0.3)" }; // Green for normal zones

          return (
            <Polygon
              key={`3-${index}`}
              positions={coordinates}
              color={zoneColors.border} // Border color
              fillColor={zoneColors.fill} // Fill color
              weight={2}
              opacity={0.5}
            >
              <Popup>
                <strong>{zone.name}</strong> <br />
                {/* Type: {zone.zoneType} */}
              </Popup>
            </Polygon>
          );
        })}

      {/* Render Vessels as Markers */}
      {locations.map((location) => (
        <Marker
          key={`4-${location.id}`}
          position={[location.lat, location.lng]}
          icon={MarkerIcon(location.type)}
          eventHandlers={{
            click: () => setSelectedLocation(location),
          }}
        >
          <Popup>{location.name}</Popup>
        </Marker>
      ))}

      {/* Render Fishing Hotspots as Circles */}
      {hotspots &&
        hotspots.map((hotspot) => (
          <Circle
            key={`5-${hotspot.hotspotId}`}
            center={[hotspot.latitude, hotspot.longitude]}
            radius={1000} // Adjust the radius as needed
            color="red"
            fillColor="red"
            fillOpacity={0.2}
            eventHandlers={{
              click: () =>
                setSelectedLocation({
                  lat: hotspot.latitude,
                  lng: hotspot.longitude,
                }),
            }}
          >
            <Popup>
              <div>
                <p>
                  <strong>Hotspot ID:</strong> {hotspot.hotspotId}
                </p>
                {/* <p>
                  <strong>Vessels:</strong> {hotspot.vesselCount}
                </p>
                <p>
                  <strong>Available Slots:</strong> {hotspot.availableSlots}
                </p> */}
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {new Date(hotspot.currentDateTime).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Circle>
        ))}

      {/* Fly to selected location if exists */}
      {selectedLocation && (
        <FlyToMarker position={[selectedLocation.lat, selectedLocation.lng]} />
      )}
    </LeafletMap>
  );
};

export default MapContainer;
