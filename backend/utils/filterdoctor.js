
// Haversine distance calculation
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  return +(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
}

// External API call to get lat/lon
async function getLatLonFromPincode(pincode) {
  const url = `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'pneumonia-risk-app' }
    });
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
  } catch (err) {
    console.error('Error fetching pincode location:', err);
  }
  return null;
}

// Main function: filters + sorts the doctors list
async function filterAndSortDoctors(doctors, pincode, age) {
  
  const ageGroup = age < 12 ? "Child" : age < 60 ? "Adult" : "Senior";
  const filtered = doctors.filter(doc => doc.age_groups.includes(ageGroup));

  const userLocation = await getLatLonFromPincode(pincode);
  if (!userLocation) {
    console.error("Invalid pincode or location not found");
    return filtered;
  }

  const sorted = filtered
    .map(doc => {
      const distance_km = getDistance(
        userLocation.lat,
        userLocation.lon,
        doc.location.latitude,
        doc.location.longitude
      );
      return { ...doc, distance_km };
    })
    .sort((a, b) => a.distance_km - b.distance_km); // nearest first

  return sorted;
}

module.exports = { filterAndSortDoctors};
