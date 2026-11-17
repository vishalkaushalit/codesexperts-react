import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// In development, API calls and uploaded images are proxied to the Express server (server/).
const API = 'http://localhost:4000';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 5173,
        proxy: {
            '/api': API,
            '/uploads': API,
            '/sitemap.xml': API,
        },
    },
});
