import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Build under /demo so it can live inside the unified domain.
  base: command === "build" ? "/demo/" : "/",
}));
