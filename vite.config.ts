import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { viteEnvs } from "vite-envs";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), viteEnvs({})],
    build: {
      chunkSizeWarningLimit: 1200,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      exclude: ["lucide-react"],
    },
  };
});
