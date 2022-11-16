import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve('./src')
    }
  },
  base: './',
  server: {
    port: 4000,
    open: true,
    cors: true,
    host: '0.0.0.0'
  }
})
