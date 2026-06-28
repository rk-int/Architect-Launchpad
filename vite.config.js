import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        name: 'Anthropic Claude LaunchPad',
        short_name: 'Claude LaunchPad',
        description: 'Claude Certified Architect 9-Week Study Tracker',
        theme_color: '#C8421A',
        background_color: '#0f0f13',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        // Pre-cache only the shell; JS chunks served stale-while-revalidate
        globPatterns: ['**/*.{html,css}', 'assets/index-*.js'],
        runtimeCaching: [
          {
            urlPattern: /\.js$/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'js-chunks' }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts' }
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons:  ['lucide-react'],
          three:  ['three', '@react-three/fiber', '@react-three/drei'],
        }
      }
    }
  }
})
