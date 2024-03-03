import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        proxy: {
            '/dz-login/': {
                target: 'https://connect.deezer.com/oauth/',
                changeOrigin: true,
                rewrite: (path: { replace: (arg0: string, arg1: string) => any }) => path.replace('/dz-login/', '')
            },
            '/dz-api/': {
                target: 'https://api.deezer.com/',
                changeOrigin: true,
                rewrite: (path: { replace: (arg0: string, arg1: string) => any }) => path.replace('/dz-api/', '')
            }
        }
    }
})