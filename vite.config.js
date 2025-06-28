import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest', // ✅ Required for custom sw.js
      srcDir: 'src', // ✅ Your service worker folder
      filename: 'sw.js', // ✅ Your service worker file
      includeAssets: [
        'vite.svg',
        'alarm.mp3',
        'pwa-192x192.png',
        'pwa-512x512.png'
      ],
      manifest: {
        name: 'Virtual Mentor',
        short_name: 'VirtualMentor',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === self.location.origin,
            handler: 'NetworkFirst',
            options: { cacheName: 'app-cache' }
          },
          {
            urlPattern: ({ url }) =>
              url.origin === 'https://hackdemo-backend.onrender.com' &&
              !url.pathname.startsWith('/api/user/'),
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache' }
          }
        ]
      }
    })
  ]
})
