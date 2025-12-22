import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { sharedPlugins } from "./vite.config.common";

export default defineConfig({
  plugins: [react(), tailwindcss(), ...sharedPlugins],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
      }
    }
  }
});
