import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      // VitePWA({
      //   devOptions: {
      //     enabled: true,
      //     type: "module",
      //   },
      //   registerType: "autoUpdate",
      //   workbox: {
      //     // globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      //     runtimeCaching: [
      //       {
      //         urlPattern: /\.(?:js|css|html)$/,
      //         handler: "StaleWhileRevalidate",
      //         options: {
      //           cacheName: "static-resources",
      //         },
      //       },
      //       {
      //         urlPattern: new RegExp("^/$"),
      //         handler: "CacheFirst",
      //         options: {
      //           cacheName: "app-shell",
      //         },
      //       },
      //       // {
      //       //   urlPattern: new RegExp("src/components/AppShell"),
      //       //   handler: "CacheFirst",
      //       // },
      //       // {
      //       //   urlPattern: ({ url }) => url.pathname.startsWith("/"),
      //       //   handler: "CacheFirst",
      //       //   options: {
      //       //     cacheName: "app-shell",
      //       //   },
      //       // },
      //     ],
      //   },
      // }),
    ],
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
