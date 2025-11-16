import { defineConfig } from "vite";

export default defineConfig({
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
