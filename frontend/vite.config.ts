import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5173", // Update this to your backend's port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
