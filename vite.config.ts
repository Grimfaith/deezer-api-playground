import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        proxy: {
            '/dz-login/auth': {
                target: 'https://connect.deezer.com/oauth/auth.php',
                changeOrigin: true,
                rewrite: (path: { replace: (arg0: string, arg1: string) => any }) => path.replace('/dz-login/auth', '')
            },
            '/dz-login/token': {
                target: 'https://connect.deezer.com/oauth/access_token.php',
                changeOrigin: true,
                rewrite: (path: { replace: (arg0: string, arg1: string) => any }) => path.replace('/dz-login/token', '')
            },
            '/dz-api/user': {
                target: 'https://api.deezer.com/user/me',
                changeOrigin: true,
                rewrite: (path: { replace: (arg0: string, arg1: string) => any }) => path.replace('/dz-api/user', '')
            }
        }
    }
})