import app_config from './app_config.env.json'

const endpoints = {
    login : "https://connect.deezer.com/oauth/auth.php",
    token : "https://connect.deezer.com/oauth/access_token.php",
    api : "https://api.deezer.com",
}

/**
 * Opens a Deezer login tab and checks the login status
 *
 * @returns {Window}
 */
export function openLoginWindow(loginWindow: Window | null) : Window | null {
    const perms : string = "email,offline_access,manage_library"
    const winFeatures: string = 'left=400,top=250,width=420,height=320'

    const authEndpoint : URL = new URL(endpoints.login)
    authEndpoint.searchParams.set("app_id", app_config.deezer.app_id)
    authEndpoint.searchParams.set("redirect_uri", window.location.origin)
    authEndpoint.searchParams.set("perms", perms)

    if (!loginWindow) {
        loginWindow = window.open(authEndpoint, 'DeezerLoginWindow', winFeatures)
    } else loginWindow.focus()

    return loginWindow
}

/**
 * Generates access token
 *
 * @returns {Promise<string | null>}
 */
async function generateAccessToken(code: string) : Promise<string | null> {
    let token = null
    const tokenEndpoint : URL = new URL(`${window.location.origin}/dz-login/token`)
    tokenEndpoint.searchParams.set("app_id", app_config.deezer.app_id)
    tokenEndpoint.searchParams.set("secret", app_config.deezer.app_secret_key)
    tokenEndpoint.searchParams.set("code", code)

    try {
        const response : Response = await fetch(tokenEndpoint.toString())
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const data : string = await response.text()
        token = data.split('&')[0].split('=')[1]
    } catch (error) {
        console.error('Error fetching token : ', error)
    }

    return token
}

/**
 * Retrieves user data from the server
 *
 * @returns {Promise<JSON>}
 */
export async function getUserData(code: string) : Promise<IUserProfile> {
    let userData = null
    let token : string | null = await generateAccessToken(code)
    const userEndpoint : URL = new URL(`${window.location.origin}/dz-api/user`)

    if (token) {
        userEndpoint.searchParams.set("access_token", token)
        try {
            const response : Response = await fetch(userEndpoint.toString())
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
            userData = await response.json()
        } catch (error) {
            console.error('Error fetching user : ', error)
        }
    }

    return userData
}