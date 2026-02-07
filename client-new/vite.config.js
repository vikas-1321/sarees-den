import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 1000, // Increases the limit from 500kb to 1000kb
  },
  resolve: {
    alias: {
      // This tells Vite "@" means the "src" folder
      "@": path.resolve(__dirname, "./src"),
    },
  },
})