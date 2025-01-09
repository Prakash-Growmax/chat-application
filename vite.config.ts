import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  console.log("🚀 ~ defineConfig ~ env:", env);

  return {
    plugins: [react()],
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
    envPrefix: "VITE_",
    define: {
      "import.meta.env.VITE_SUPABASE_URL": `"${process.env.VITE_SUPABASE_URL}"`,
      "import.meta.env.VITE_SUPABASE_ANON_KEY": `"${process.env.VITE_SUPABASE_ANON_KEY}"`,
      "import.meta.env.VITE_API_URL": `"${process.env.VITE_API_URL}"`,
    },
  };
});
