import L from "leaflet";
import Marker01 from '../../assets/markers/marker_gateway.png'
import Marker02 from '../../assets/markers/marker_vessel.png'

const MarkerIcon = (type) => {
  return new L.Icon({
    iconUrl:
      type === "gateway"
        ? Marker01
        : Marker02,
    iconSize: [28, 32],
    iconAnchor: [14, 32],
  });
};

export default MarkerIcon;
