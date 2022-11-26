import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
//import mkcert from 'vite-plugin-mkcert';
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: { 
    // https: {
    //   key: fs.readFileSync('./.cert/key.pem'),
    //   cert: fs.readFileSync('./.cert/cert.pem'),
    // },
    https: {
      key: fs.readFileSync('.certs/key.pem'),
      cert: fs.readFileSync('certs/cert.pem'),
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
