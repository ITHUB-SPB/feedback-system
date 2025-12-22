import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from '@tanstack/router-plugin/vite'
// import { analyzer } from "vite-bundle-analyzer";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react()
  ],
  server: {
    cors: false,
    host: true,
    port: 5174,
    strictPort: true,
  },
  esbuild: {
    minifyIdentifiers: false,
    minifySyntax: false,
  },
  build: {
    rollupOptions: {},
  },
});
