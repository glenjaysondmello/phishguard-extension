import { defineConfig } from "vite";
import { sharedPlugins } from "./vite.config.common";

export default defineConfig({
  plugins: [...sharedPlugins],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: "src/contentScript.ts",
      output: {
        format: "iife",
        inlineDynamicImports: true,
        entryFileNames: "contentScript.js"
      }
    }
  }
});
