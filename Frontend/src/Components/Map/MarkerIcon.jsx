import L from "leaflet";
import Marker01 from '../../assets/markers/m1.png'
import Marker02 from '../../assets/markers/m2.png'

const MarkerIcon = (type) => {
  return new L.Icon({
    iconUrl:
      type === "gateway"
        ? Marker01
        : Marker02,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

export default MarkerIcon;
