// Not used currently but kept for reference
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
        background: resolve(__dirname, "src/background.ts"),
        contentScript: resolve(__dirname, "src/contentScript.ts"),
      },
      output: {
        format: "iife",
        inlineDynamicImports: false,
        // ensure background and contentScript are emitted at top-level with these names
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "popup" || chunkInfo.name === "dashboard") {
            return "assets/[name]-[hash].js";
          }

          if (chunkInfo.name === "background") return "background.js";
          if (chunkInfo.name === "contentScript") return "contentScript.js";
          // default for other entries (pop up assets)
          return "assets/[name]-[hash].js";
        },
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
    sourcemap: true,
    target: "es2020",
  },
});
