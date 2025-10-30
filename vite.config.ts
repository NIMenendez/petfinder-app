import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: './fe-petfinder',
  publicDir: './public',
  build: {
    outDir: '../dist'
  },
  server: {
    port: 3001,
    open: true
  },
  envDir: path.resolve(__dirname, '.')
})