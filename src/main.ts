import './style.css'
import app_config from './app_config.env.json'

interface IWindowMessage {
    originName : 'DeezerAPG'
    type : 'loginStatus'
    message : object
}

let appLoginStatus : IWindowMessage = {
    originName : 'DeezerAPG',
    type : 'loginStatus',
    message : {
        isLogged : false,
        code : "null"
    }
}

let loginWindow: Window | null = null

window.addEventListener("message", (event) => {
    // Skip if the message is not from us
    if (event.origin !== window.location.origin || event.data.originName !== 'DeezerAPG') return

    loginStatusWindowMessageHandler(event)
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
                event.source.postMessage(appLoginStatus, window.location.origin);
            }
        } else appLoginStatus = event.data
    }
}

/**
 * Handles the login step
 * Checks if the user is logged in or if there are query parameters with code
 *
 * @return {void}
 */
function loginStepHandler() : void {
    let loggedIn = appLoginStatus.message.isLogged || checkQueryParams('code')
    const loginSection = document.querySelector<HTMLElement>('section.login')

    if (loginSection) {
        if (loggedIn) {
            loginSection.innerHTML = `
                <p style="margin: 0">Connected.. redirection in 2s</p>
            `
        } else {
            const loginButton = loginSection.querySelector<HTMLAnchorElement>('.dz-login')
            if (loginButton) loginButton.addEventListener('click', openDeezerLoginTab)
        }
    }
}

/**
 * Opens a Deezer login tab and checks the login status
 *
 * @returns {void}
 */
function openDeezerLoginTab() : void {
    const authEndpoint = new URL(`${window.location.origin}/dz-login`)
    authEndpoint.searchParams.set("app_id", app_config.deezer.app_id)
    authEndpoint.searchParams.set("redirect_uri", window.location.origin)

    if (loginWindow === null || loginWindow.closed) {
        loginWindow = window.open(authEndpoint.toString(), 'DeezerLoginWindow')
    } else {
        loginWindow.focus()
    }

    checkLoginStatus()
}

/**
 * Checks the login status using a timer
 *
 * @returns {void}
 */
function checkLoginStatus() : void {
    let checkingStatus = setInterval(() => {
        if (loginWindow) {
            // @ts-ignore
            if (appLoginStatus.message.isLogged) loginWindow.close()
            else loginWindow.postMessage(appLoginStatus, window.location.origin)
        } else clearInterval(checkingStatus)
    }, 2500)
}

/**
 * Checks if the given key exists in the query parameters of the current URL
 *
 * @param {string} key
 * @returns {(string|null)}
 */
function checkQueryParams (key : string) : string | null {
    let qParams = new URLSearchParams(window.location.search)
    if(qParams.has(key)) return qParams.get(key)
    return null
}