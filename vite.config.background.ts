import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: "src/background.ts",
      output: { format: "iife", entryFileNames: "background.js" },
    },
  },
});
