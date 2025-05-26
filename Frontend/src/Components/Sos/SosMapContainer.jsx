import React from "react";
import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import FlyToMarker from "../Map/FlyToMarker";
import MarkerIcon from "../Map/MarkerIcon";


const defaultCenter = [6.7115, 79.9044];

const SosMapContainer = ({ sosdata }) => {
  return (
    <LeafletMap
      center={defaultCenter}
      zoom={12}
      className="h-full w-full rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />

      <Marker
        key={`s1-${sosdata.vesselId}`}
        position={[sosdata.lat, sosdata.lng]}
        icon={MarkerIcon('vessel')}
      >
        <Popup>{sosdata.vesselId}</Popup>
      </Marker>

      {sosdata && <FlyToMarker position={[sosdata.lat, sosdata.lng]} />}
    </LeafletMap>
  );
};

export default SosMapContainer;
