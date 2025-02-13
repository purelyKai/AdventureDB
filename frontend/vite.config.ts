import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  logLevel: 'info',
  plugins: [react()],
  server: {
    open: true,
  },
});
