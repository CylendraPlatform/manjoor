import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import viteCapacitorFix from "./vite-capacitor-fix.js";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [react(), viteCapacitorFix()],
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
    modulePreload: false,
    minify: true,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      }
    }
  }
}));

