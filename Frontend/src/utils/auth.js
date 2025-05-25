import { jwtDecode } from "jwt-decode";

export const getToken = () => localStorage.getItem("authToken");

export const saveToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const removeToken = () => {
  localStorage.removeItem("authToken");
};

// Decode the token and check its expiration
export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      return true;
    }
    return false;
  } catch (error) {
    return true;
  }
};

// Modified isAuthenticated function to check expiration
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
};

// Get user role from token
export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const { role } = jwtDecode(token);
    return role;
  } catch (error) {
    return null;
  }
};
