// Not used currently but kept for reference
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        background: "src/background.ts",
        contentScript: "src/contentScript.ts",
      },
      output: {
        format: "iife",
        inlineDynamicImports: true, // REQUIRED for IIFE build
        entryFileNames: "[name].js"
      }
    }
  }
});
