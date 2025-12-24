import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    devtools(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    viteReact(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  optimizeDeps: {
    noDiscovery: true,
  },
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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            const modulePath = id.split("node_modules/")[1];
            const topLevelFolder = modulePath?.split("/")[0];
            if (topLevelFolder !== ".pnpm") {
              return topLevelFolder;
            }
            const scopedPackageName = modulePath?.split("/")[1];
            const chunkName =
              scopedPackageName?.split("@")[
                scopedPackageName.startsWith("@") ? 1 : 0
              ];
            return chunkName;
          }
        },
      },
    },
  },
});
