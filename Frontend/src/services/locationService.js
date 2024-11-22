export const fetchLocations = async () => {
    const response = await fetch("/api/locations"); // Replace with your backend API
    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }
    return response.json();
  };
  