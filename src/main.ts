import './style.css'
import app_config from './app_config.env.json'

interface IWindowMessage {
    originName : 'DeezerAPG'
    type : string
    message : any
}

let appLoginStatus : IWindowMessage = {
    originName : 'DeezerAPG',
    type : 'loginStatus',
    message : {
        isLogged : false,
        code : "null"
    }
}

const deezerEndpoints = {
    login : "https://connect.deezer.com/oauth/auth.php",
    token : "https://connect.deezer.com/oauth/access_token.php",
    api : "https://api.deezer.com",
}

let loginWindow : Window | null = null

window.addEventListener("message", (event) => {
    // Skip if the message is not from us
    if (event.origin !== window.location.origin || event.data.originName !== appLoginStatus.originName) return
    else loginStatusWindowMessageHandler(event)
})

document.addEventListener('DOMContentLoaded', () => {
    loginStepHandler()
})

/**
 * Handles the window message received by the login status window
 *
 * @param {MessageEvent<any>} event
 */
function loginStatusWindowMessageHandler(event : MessageEvent<any>) : void {
    if (event.data.type === 'loginStatus') {
        if (!event.data.message.isLogged) {
            let code = checkQueryParams('code')
            if (code) {
                appLoginStatus.message.code = code;
                appLoginStatus.message.isLogged = true;
                // @ts-ignore
                event.source.postMessage(appLoginStatus, event.origin)
            }
        } else {
            appLoginStatus = event.data
            loginWindow?.close()
            loginStepHandler()
        }
    }
}

/**
 * Handles the login step
 * Checks if the user is logged in or if there are query parameters with code
 *
 * @return {void}
 */
function loginStepHandler() : void {
    const loginSection = document.querySelector<HTMLElement>('section.login')
    if (loginSection) {
        if (appLoginStatus.message.isLogged) {
            getUserData().then(userData => {
                console.log(userData)
                loginSection.innerHTML = `
                    <p>Great ${userData.firstname} ! you are logged in.</p>
                    <a href="#" class="btn" onClick="window.location.reload()">Logout</a>
                `
            })
        } else if (checkQueryParams('code')) {
            loginSection.innerHTML = `
                <p style="margin: 0">Connected.. redirection in 2s</p>
            `
        } else {
            const loginButton = loginSection.querySelector<HTMLAnchorElement>('.dz-login')
            loginButton?.addEventListener('click', openDeezerLoginTab)
        }
    }
}

/**
 * Opens a Deezer login tab and checks the login status
 *
 * @returns {void}
 */
function openDeezerLoginTab() : void {
    const perms : string = "email,offline_access,manage_library"
    const winFeatures: string = 'left=400,top=250,width=420,height=320'

    const authEndpoint = new URL(deezerEndpoints.login)
    authEndpoint.searchParams.set("app_id", app_config.deezer.app_id)
    authEndpoint.searchParams.set("redirect_uri", window.location.origin)
    authEndpoint.searchParams.set("perms", perms)

    if (loginWindow === null || loginWindow.closed) {
        loginWindow = window.open(authEndpoint, 'DeezerLoginWindow', winFeatures)
    } else loginWindow.focus()

    checkLoginStatus()
}

/**
 * Checks the login status using a timer
 *
 * @returns {void}
 */
function checkLoginStatus() : void {
    let checkingStatus = setInterval(() => {
        if (appLoginStatus.message.isLogged) clearInterval(checkingStatus)
        else loginWindow?.postMessage(appLoginStatus, window.location.origin)
    }, 2500)
}

/**
 * Generates a token.
 *
 * @returns {Promise<string | null>}
 */
async function generateAccessToken() : Promise<string | null> {
    let token = null
    const tokenEndpoint = new URL(`${window.location.origin}/dz-login/token`)
    tokenEndpoint.searchParams.set("app_id", app_config.deezer.app_id)
    tokenEndpoint.searchParams.set("secret", app_config.deezer.app_secret_key)
    tokenEndpoint.searchParams.set("code", appLoginStatus.message.code)

    try {
        const response = await fetch(tokenEndpoint.toString())
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const data = await response.text()
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
async function getUserData() : Promise<any> {
    let userData = null
    let token = await generateAccessToken()
    const userEndpoint = new URL(`${window.location.origin}/dz-api/user`)

    if (token) {
        userEndpoint.searchParams.set("access_token", token)
        try {
            const response = await fetch(userEndpoint.toString())
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
            userData = await response.json()
        } catch (error) {
            console.error('Error fetching user : ', error)
        }
    }

    return userData
}

/**
 * Checks if the given key exists in the query parameters of the current URL
 *
 * @param {string} key
 * @returns {(string|null)}
 */
function checkQueryParams (key : string) : string | null {
    let qParams = new URLSearchParams(window.location.search)
    if (qParams.has(key)) return qParams.get(key)
    else return null
}