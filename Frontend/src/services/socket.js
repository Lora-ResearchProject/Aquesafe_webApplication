// import { io } from "socket.io-client";
// import { baseURL } from "../config/config";

// const socket = io(baseURL, {
//   transports: ["websocket"], // Force WebSocket connection
// }); // Adjust based on your backend URL

// // Function to emit events
// export const emitEvent = (eventName, data) => {
//   socket.emit(eventName, data);
// };

// // Function to listen for events
// export const listenEvent = (eventName, callback) => {
//   socket.on(eventName, callback);
// };

// // Function to remove event listeners (prevent memory leaks)
// export const removeListener = (eventName) => {
//   socket.off(eventName);
// };

// // Export the socket instance if needed
// export default socket;


import { baseURL } from "../config/config";
import { io } from "socket.io-client";

export const socket = io(baseURL, {
  transports: ["websocket"],
});
console.log("🚀 ~ socket:", socket)
console.log("🚀 ~ baseURL:", baseURL)

// Log all received events
socket.onAny((event, ...args) => {
  console.log(`📥 [Client Received] Event: "${event}"`, args);
});

// Log outgoing emits
export const emitEvent = (eventName, data) => {
  console.log(`📤 [Client Emit] Event: "${eventName}"`, data);
  socket.emit(eventName, data);
};

// Listen wrapper
export const listenEvent = (eventName, callback) => {
  socket.on(eventName, callback);
};

// Remove listener wrapper
export const removeListener = (eventName) => {
  socket.off(eventName);
};
