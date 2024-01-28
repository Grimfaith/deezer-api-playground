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
    const winFeatures: string = 'left=400,top=250,width=620,height=320'

    const authEndpoint : URL = new URL(endpoints.login)
    authEndpoint.searchParams.set("app_id", app_config.deezer.app_id)
    authEndpoint.searchParams.set("redirect_uri", window.location.origin)
    authEndpoint.searchParams.set("perms", perms)

    if (!loginWindow || loginWindow.closed) loginWindow = window.open(authEndpoint, 'DeezerLoginWindow', winFeatures)
    else loginWindow.focus()

    return loginWindow
}

/**
 * Generates an access token using the provided user OAuth code
 *
 * @param {string} code
 * @return {Promise<string|null>}
 */
export async function generateAccessToken(code: string) : Promise<IAccess_Token | null> {
    const tokenEndpoint : URL = new URL(`${window.location.origin}/dz-login/token`)
    tokenEndpoint.searchParams.set("app_id", app_config.deezer.app_id)
    tokenEndpoint.searchParams.set("secret", app_config.deezer.app_secret_key)
    tokenEndpoint.searchParams.set("code", code)
    tokenEndpoint.searchParams.set("output", 'json')

    try {
        const response : Response = await fetch(tokenEndpoint.toString())
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        return await response.json()
    } catch (error) {
        console.error('Error fetching token : ', error)
        return null
    }
}

/**
 * Retrieves user data
 *
 * @param {string} access_token
 * @return {Promise<IUserProfile | null>}
 * @throws {Error}
 */
export async function getUserData(access_token: string) : Promise<IUserProfile | null> {
    const userEndpoint : URL = new URL(`${window.location.origin}/dz-api/user/me`)

    if (access_token) {
        userEndpoint.searchParams.set("access_token", access_token)
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
 * @return {Promise<Array<IUserFlowTrack> | null>}
 * @throws {Error}
 */
export async function getUserFlow(userID: number) : Promise<Array<IUserFlowTrack> | null> {
    const flowEndpoint : URL = new URL(`${window.location.origin}/dz-api/user/${userID}/flow`)

    try {
        const response : Response = await fetch(flowEndpoint.toString())
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        let flow =  await response.json()
        return flow.data
    } catch (error) {
        console.error('Error fetching user flow : ', error)
        return null
    }
}

/**
 * Retrieves user playlists
 *
 * @param {string} access_token
 * @return {Promise<Array<IUserPlaylist> | null>}
 * @throws {Error}
 */
export async function getUserPlaylists(access_token: string) : Promise<Array<IUserPlaylist> | null> {
    const playlistsEndpoint : URL = new URL(`${window.location.origin}/dz-api/user/me/playlists`)

    if (access_token) {
        playlistsEndpoint.searchParams.set("access_token", access_token)
        try {
            const response : Response = await fetch(playlistsEndpoint.toString())
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
            return response.json()
        } catch (error) {
            console.error('Error fetching playlists : ', error)
            return null
        }
    } else return null
}

/**
 * Retrieves OEmbed player for a given URL
 *
 * @param {string} url
 * @returns {Promise<object|null>}
 * @throws {Error}
 */
export async function getOEmbed(url: string) : Promise<object | null> {
    const oEmbedEndpoint : URL = new URL(`${window.location.origin}/dz-api/oembed`)
    oEmbedEndpoint.searchParams.set("url", url)

    try {
        const response : Response = await fetch(oEmbedEndpoint.toString())
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        return await response.json()
    } catch (error) {
        console.error('Error fetching user flow : ', error)
        return null
    }
}