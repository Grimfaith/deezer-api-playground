import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        proxy: {
            '/dz-login/auth': {
                target: 'https://connect.deezer.com/oauth/auth.php',
                changeOrigin: true
            },
            '/dz-login/token': {
                target: 'https://connect.deezer.com/oauth/access_token.php',
                changeOrigin: true
            },
            '/dz-api': {
                target: 'https://api.deezer.com',
                changeOrigin: true
            }
        }
    }
})