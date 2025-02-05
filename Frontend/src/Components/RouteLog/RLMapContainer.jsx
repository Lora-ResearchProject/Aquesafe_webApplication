import React from "react";
import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import FlyToMarker from "../Map/FlyToMarker";
import MarkerIcon from "../Map/MarkerIcon";

const defaultCenter = [7.8731, 80.7718];

const RLMapContainer = ({ locations }) => {
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
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={[location.lat, location.lng]}
          icon={MarkerIcon()}
        >
          <Popup>{new Date(location.dateTime).toLocaleString()}</Popup>
        </Marker>
      ))}
      {locations.length > 1 && (
        <Polyline
          positions={locations.map((loc) => [loc.lat, loc.lng])}
          color="blue"
        />
      )}
      {locations.length > 0 && (
        <FlyToMarker position={[locations[0].lat, locations[0].lng]} />
      )}
    </LeafletMap>
  );
};

export default RLMapContainer;
