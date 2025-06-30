import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // ✅ Use root base for Netlify
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
});
