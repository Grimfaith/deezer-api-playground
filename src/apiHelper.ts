import app_config from './app_config.env.json'

const endpoints = {
    login : "https://connect.deezer.com/oauth/auth.php",
    token : "https://connect.deezer.com/oauth/access_token.php",
    api : "https://api.deezer.com",
}

/**
 * Opens the login window for Deezer authentication
 *
 * @param {Window | null} loginWindow
 * @returns {Window | null}
 */
export function openLoginWindow(loginWindow: Window | null) : Window | null {
    const perms : string = "email,offline_access,manage_library"
    const winFeatures: string = 'left=400,top=250,width=420,height=320'

    const authEndpoint : URL = new URL(endpoints.login)
    authEndpoint.searchParams.set("app_id", app_config.deezer.app_id)
    authEndpoint.searchParams.set("redirect_uri", window.location.origin)
    authEndpoint.searchParams.set("perms", perms)

    if (!loginWindow) loginWindow = window.open(authEndpoint, 'DeezerLoginWindow', winFeatures)
    else loginWindow.focus()

    return loginWindow
}

/**
 * Generates an access token using the provided user OAuth code
 *
 * @param {string} code
 * @return {Promise<string|null>}
 */
async function generateAccessToken(code: string) : Promise<string | null> {
    const tokenEndpoint : URL = new URL(`${window.location.origin}/dz-login/token`)
    tokenEndpoint.searchParams.set("app_id", app_config.deezer.app_id)
    tokenEndpoint.searchParams.set("secret", app_config.deezer.app_secret_key)
    tokenEndpoint.searchParams.set("code", code)

    try {
        const response : Response = await fetch(tokenEndpoint.toString())
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const data : string = await response.text()
        return  data.split('&')[0].split('=')[1]
    } catch (error) {
        console.error('Error fetching token : ', error)
        return null
    }
}

/**
 * Retrieves user data from the server
 *
 * @returns {Promise<JSON|null>}
 */
export async function getUserData(code: string) : Promise<IUserProfile | null> {
    let token : string | null = await generateAccessToken(code)
    const userEndpoint : URL = new URL(`${window.location.origin}/dz-api/user/me`)

    if (token) {
        userEndpoint.searchParams.set("access_token", token)
        try {
            const response : Response = await fetch(userEndpoint.toString())
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
            return await response.json()
        } catch (error) {
            console.error('Error fetching user : ', error)
            return null
        }
    } else return null
}

/**
 * Retrieves the user flow for the specified user ID
 *
 * @param {number} userID
 * @return {Promise<object|null>}
 */
export async function getUserFlow(userID: number) : Promise<any> {
    const flowEndpoint : URL = new URL(`${window.location.origin}/dz-api/user/${userID}/flow`)

    try {
        const response : Response = await fetch(flowEndpoint.toString())
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        return await response.json()
    } catch (error) {
        console.error('Error fetching user flow : ', error)
        return null
    }
}