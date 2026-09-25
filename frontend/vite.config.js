import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { isCmsSource, transformCmsSource } from './scripts/cms-transform.mjs'

const cmsPlugin = {
  name: 'visibi-wordpress-content',
  enforce: 'pre',
  transform(source, id) {
    if (!isCmsSource(id)) return null
    return transformCmsSource(source, id).code
  },
}

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  build: { manifest: Boolean(process.env.VITE_WORDPRESS_THEME) },
  plugins: [cmsPlugin, react()],
  resolve: {
    alias: {
      ...(process.env.VITE_WORDPRESS_THEME ? { 'react-helmet-async': path.resolve(__dirname, './src/cms/helmet-wordpress.jsx') } : {}),
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/wp-cms': {
        target: process.env.WORDPRESS_PROXY_TARGET || 'http://host.docker.internal:8082',
        changeOrigin: true,
        rewrite: requestPath => requestPath.replace(/^\/wp-cms/, ''),
      },
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  preview: {
    host: true,
    port: process.env.PORT || 5174,
    strictPort: false
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.js'],
  }
})