import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Automatically updates the service worker
      devOptions: {
        enabled: true, // Enables PWA in development mode for testing
      },
      includeAssets: ["favicon.ico", "icon-192x192.png", "icon-512x512.png"], // Assets to include in the precache
      manifest: {
        name: "Ibad Allah",
        short_name: "IbadAllah",
        description:
          "A Progressive Web App for Ibad Allah built with React, Tailwind CSS, and MongoDB",
        theme_color: "#000000",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,svg,ico}"], // Cache JS, CSS, HTML, and images
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst", // Try network first, fallback to cache
            options: {
              cacheName: "html-cache",
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst", // Cache images first
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
              },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/"), // Cache API responses
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60, // Cache for 1 day
              },
            },
          },
        ],
      },
    }),
  ],
});
