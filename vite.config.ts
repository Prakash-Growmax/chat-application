import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import federation from "@originjs/vite-plugin-federation";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "ansight",
      filename: "remoteEntry.js",
      exposes: {
        "./AnsightApp": "./src/App.tsx",
        "./ChatInterface": "./src/components/Chat/ChatInterface.tsx",
        "./ProfileModule": "./src/components/Profile/ProfileModule.tsx",
        "./TeamModule": "./src/components/Team/TeamModule.tsx",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
        "react-router-dom": { singleton: true, requiredVersion: "^6.0.0" },
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
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
    exclude: [...configDefaults.exclude, "node_modules"],
  },
});
