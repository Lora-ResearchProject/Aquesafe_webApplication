import React from "react";
import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  Polygon,
} from "react-leaflet";
import FlyToMarker from "./FlyToMarker";
import MarkerIcon from "./MarkerIcon";

const defaultCenter = [7.8731, 80.7718];

const MapContainer = ({
  locations,
  selectedLocation,
  setSelectedLocation,
  zones,
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

          return (
            <Polygon
              key={index}
              positions={coordinates}
              color="blue"
              weight={2}
              opacity={0.6}
            >
              <Popup>{zone.name}</Popup>
            </Polygon>
          );
        })}

      {/* Render Vessels as Markers */}
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={MarkerIcon(location.type)}
          eventHandlers={{
            click: () => setSelectedLocation(location),
          }}
        >
          <Popup>{location.name}</Popup>
        </Marker>
      ))}

      {/* Fly to selected location if exists */}
      {selectedLocation && (
        <FlyToMarker position={[selectedLocation.lat, selectedLocation.lng]} />
      )}
    </LeafletMap>
  );
};

export default MapContainer;
