import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import mkcert from 'vite-plugin-mkcert';
//import fs from "node:fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), mkcert()],
  server: { https: false},
  // https: {
  //   key: fs.readFileSync("/home/ubuntu/coding/listapp2/web/certs/key.pem"),
  //   cert: fs.readFileSync("/home/ubuntu/coding/listapp2/web/certs/cert1.pem"),
  // },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
// 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
