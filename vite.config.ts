import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/FIGURE-OUT/',  // <-- Add your exact repository name here
})
