import app_config from './app_config.env.json'

const host= import.meta.env.DEV ? {
    login : `${window.location.origin}/dz-login`,
    api : `${window.location.origin}/dz-api`
} : {
    login : 'https://connect.deezer.com/oauth',
    api : 'https://api.deezer.com'
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

    const authEndpoint : URL = new URL(`${host.login}/auth.php`)
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
 * @throws {Error}
 */
export async function generateAccessToken(code: string) : Promise<IAccess_Token | null> {
    const tokenEndpoint : URL = new URL(`${host.login}/access_token.php`)
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
 * @return {Promise<IUser | null>}
 * @throws {Error}
 */
export async function getUserData(access_token: string) : Promise<IUser | null> {
    const userEndpoint : URL = new URL(`${host.api}/user/me`)
    userEndpoint.searchParams.set("access_token", access_token)

    try {
        const response : Response = await fetch(userEndpoint.toString())
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        return await response.json()
    } catch (error) {
        console.error('Error fetching user data : ', error)
        return null
    }
}

/**
 * Retrieves the user flow for the specified user ID
 *
 * @param {number} userID
 * @return {Promise<Array<ITrack> | null>}
 * @throws {Error}
 */
export async function getUserFlow(userID: number) : Promise<Array<ITrack> | null> {
    const flowEndpoint : URL = new URL(`${host.api}/user/${userID}/flow`)

    try {
        const response : Response = await fetch(flowEndpoint.toString())
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const { data: flow } = await response.json()
        return flow
    } catch (error) {
        console.error('Error fetching user flow : ', error)
        return null
    }
}

/**
 * Retrieves user playlists
 *
 * @param {string} access_token
 * @return {Promise<Array<IPlaylist> | null>}
 * @throws {Error}
 */
export async function getUserPlaylists(access_token: string) : Promise<Array<IPlaylist> | null> {
    const playlistsEndpoint : URL = new URL(`${host.api}/user/me/playlists`)
    playlistsEndpoint.searchParams.set("access_token", access_token)

    try {
        const response : Response = await fetch(playlistsEndpoint.toString())
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const { data: playlists } = await response.json()
        return playlists
    } catch (error) {
        console.error('Error fetching playlists : ', error)
        return null
    }
}

/**
 * Retrieves the tracks of a playlist
 *
 * @param {string} access_token
 * @param {number} playlistID
 * @return {Promise<Array<ITrack> | null>}
 */
export async function getPlaylistTracks(access_token: string, playlistID: number) : Promise<Array<ITrack> | null> {
    const playlistTracksEndpoint : URL = new URL(`${host.api}/playlist/${playlistID}/tracks`)
    playlistTracksEndpoint.searchParams.set("access_token", access_token)
    playlistTracksEndpoint.searchParams.set("limit", "667")

    try {
        const response : Response = await fetch(playlistTracksEndpoint.toString())
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const { data: tracks } = await response.json()
        return tracks
    } catch (error) {
        console.error('Error fetching playlist tracks : ', error)
        return null
    }
}

/**
 * Retrieves OEmbed player for a given URL
 *
 * @param {string} url
 * @returns {Promise<object|null>}
 * @throws {Error}
 */
export async function getOEmbed(url: string) : Promise<object | null> {
    const oEmbedEndpoint : URL = new URL(`${host.api}/oembed`)
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