import { defineConfig } from "vite";
import { sharedPlugins } from "./vite.config.common";

export default defineConfig({
  plugins: [...sharedPlugins],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: "src/background.ts",
      output: { format: "iife", entryFileNames: "background.js" },
    },
  },
});