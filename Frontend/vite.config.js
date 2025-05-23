import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 9000, // Optional: your dev port
    strictPort: true, // Optional: fail if port is in use
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
