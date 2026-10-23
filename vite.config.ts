import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Nouvelle version téléchargée en arrière-plan, appliquée au prochain lancement.
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Zoi Tracker',
        short_name: 'Zoi Tracker',
        description: 'Carnet de bord pour suivre ses familles et ses Zois dans inZOI',
        lang: 'fr',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#ECECF0',
        theme_color: '#DCEBFA',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,webp,woff2,svg}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  base: './',
})
