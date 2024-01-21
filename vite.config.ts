import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        proxy: {
            '/dz-login': {
                target: 'https://connect.deezer.com/oauth/auth.php',
                changeOrigin: true
            }
        }
    }
})