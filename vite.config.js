import { defineConfig } from 'vite'

// created to force HMR ON
export default defineConfig({
  server: {
    hmr: true,
    watch: {
      usePolling: true, 
    }
  }
})
