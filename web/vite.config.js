import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: { 
    https: {
      key: fs.readFileSync("/home/ubuntu/coding/listapp2/web/certs/key.pem"),
      cert: fs.readFileSync("/home/ubuntu/coding/listapp2/web/certs/cert1.pem"),
    }
   },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
