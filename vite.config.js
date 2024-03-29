import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          //isCustomElement: (tag) => tag.includes("value-here"),
        },
        transformAssetUrls: {
          // default tags
          tags: {
            video: ["src", "poster"],
            source: ["src"],
            img: ["src"],
            image: ["xlink:href", "href"],
            use: ["xlink:href", "href"],
          },
        },
      },
    }),
  ],
  base: "/magicardt/",
  define: {
    "process.env": {},
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
