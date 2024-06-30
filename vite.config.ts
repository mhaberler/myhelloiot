import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";
import { compression } from "vite-plugin-compression2";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/apps/myhelloiot/",
  // https://stackoverflow.com/questions/71255838/shorten-file-names-in-react-build-directory-to-less-than-32-chars
  build: {
    rollupOptions: {
      output: {
        assetFileNames: "a/[hash:10][extname]",
        chunkFileNames: "c/[hash:10].js",
        entryFileNames: "e/[hash:10].js"
      }
    }
  },
  plugins: [
    react(),
    svgr(),
    compression({ include: /\.js$/i, deleteOriginalAssets: true }),
    VitePWA({
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,wav,mp3,gltf,bin,eot,ttf,woff,woff2,txt,json}",
        ],
        maximumFileSizeToCacheInBytes: 25097152,
      },
      includeAssets: ["**/*"],
      manifest: {
        name: "MYHELLOIOT",
        short_name: "MYHELLOIOT",
        description: "MYHELLOIOT MQTT Dashboard",
        theme_color: "#001528",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
