import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"   // 👈 use node: prefix for core modules

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
