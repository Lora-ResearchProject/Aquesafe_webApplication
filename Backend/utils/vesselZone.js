function isVesselInZone(vessel, zone) {
  const { lat, lng } = vessel; // Assuming vessel has lat and lng properties
  const polygon = zone.boundary; // Array of { lat, lng } objects

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat, yi = polygon[i].lng;
    const xj = polygon[j].lat, yj = polygon[j].lng;

    const intersect = ((yi > lat) !== (yj > lat)) &&
      (lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }
  return inside;
}

module.exports = { isVesselInZone };