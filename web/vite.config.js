import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: { 
    https: {
      key: fileURLToPath(new URL(".certs/key.pem", import.meta.url)),
      cert: fileURLToPath(new URL(".certs/cert1.pem", import.meta.url)),
    }
   },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
