import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Production builds are served from https://sanchitjain92-dbt.github.io/nemi-jain-portfolio/
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/nemi-jain-portfolio/' : '/',
  plugins: [react()],
  server: { port: 5173, open: false },
}));
