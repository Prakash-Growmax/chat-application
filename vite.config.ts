import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';
import { defineConfig } from 'vite';

dotenv.config();

const viteEnvVariables = Object.keys(process.env)
  .filter(key => key.startsWith('VITE_')) // Only include variables with VITE_ prefix
  .reduce((env, key) => {
    env[`import.meta.env.${key}`] = JSON.stringify(process.env[key]);
    return env;
  }, {});

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: viteEnvVariables, // Inject environment variables
});