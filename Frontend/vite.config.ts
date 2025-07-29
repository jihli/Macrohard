import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Matches create-react-app's default port
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});