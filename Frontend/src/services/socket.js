import { io } from "socket.io-client";
import { baseURL } from "../config/config";

const socket = io(baseURL); // Adjust based on your backend URL

// Function to emit events
export const emitEvent = (eventName, data) => {
  socket.emit(eventName, data);
};

// Function to listen for events
export const listenEvent = (eventName, callback) => {
  socket.on(eventName, callback);
};

// Function to remove event listeners (prevent memory leaks)
export const removeListener = (eventName) => {
  socket.off(eventName);
};

// Export the socket instance if needed
export default socket;