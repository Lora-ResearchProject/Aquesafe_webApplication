import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Detect whether we're in development
const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  plugins: [react()],
  server: isDev
    ? {
        host: true,
        port: 9000,
        strictPort: true,
        allowedHosts: ["app.aquasafe.fish"],
        hmr: {
          host: "localhost",
          port: 9000,
        },
      }
    : {
        hmr: false, // Disable HMR in production
      },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});