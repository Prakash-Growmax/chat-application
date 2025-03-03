import federation from "@originjs/vite-plugin-federation";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "ansight",
      filename: "remoteEntry.js",
      exposes: {
        // Expose main components that the host will import
        "./AnsightApp": "./src/App.tsx",
        "./ChatInterface": "./src/components/Chat/ChatInterface.tsx", // Adjust path as needed
        "./ProfileModule": "./src/components/Profile/ProfileModule.tsx", // Adjust path as needed
        "./TeamModule": "./src/components/Team/TeamModule.tsx", // Adjust path as needed
      },
      shared: {
        // Share dependencies with host to avoid duplication
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
        "react-router-dom": { singleton: true, requiredVersion: "^6.0.0" },
        // Add other shared dependencies as needed
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1200,
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});