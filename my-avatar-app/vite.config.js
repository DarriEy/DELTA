import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Specify the port you want Vite to use
    hmr: {
      overlay: true, // Ensure HMR overlay is enabled
    },
  },
});