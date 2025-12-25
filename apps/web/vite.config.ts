import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  publicDir: "public",
  server: {
    port: 5175,
    host: true,
    strictPort: true
  },
  build: {
    outDir: "dist",
  },
  esbuild: {
    minifyIdentifiers: false,
    minifySyntax: false,
    minifyWhitespace: false,
  },
  plugins: [],
});
