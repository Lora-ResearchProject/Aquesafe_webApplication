function isVesselInZone(vessel, zone) {
  const { lat, lng } = vessel; // lat = Y, lng = X
  const polygon = zone.boundary;

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng, yi = polygon[i].lat;
    const xj = polygon[j].lng, yj = polygon[j].lat;

    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}

module.exports = { isVesselInZone };