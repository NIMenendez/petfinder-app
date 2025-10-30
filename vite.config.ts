import { defineConfig } from 'vite'

export default defineConfig({
  root: './fe-petfinder',
  publicDir: './public',
  build: {
    outDir: '../dist'
  },
  server: {
    port: 3001,
    open: true
  }
})