import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Landing + sub-pages are static HTML. Portal is a React SPA sharing the same
// site.css design tokens (served from /src/styles/site.css).
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about/index.html',
        services: 'services/index.html',
        testimonials: 'testimonials/index.html',
        contact: 'contact/index.html',
        portal: 'portal/index.html',
      },
    },
  },
})
