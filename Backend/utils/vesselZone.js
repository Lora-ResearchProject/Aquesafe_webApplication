exports.isVesselInZone = (vessel, zone) => {
  const { lat, lng } = vessel;
  const boundary = zone.boundary;

  // Implementing a basic bounding box check
  const minLat = Math.min(...boundary.map((point) => point.lat));
  const maxLat = Math.max(...boundary.map((point) => point.lat));
  const minLng = Math.min(...boundary.map((point) => point.lng));
  const maxLng = Math.max(...boundary.map((point) => point.lng));

  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
};
