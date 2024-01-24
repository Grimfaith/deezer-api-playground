import * as Utils from'./utils'
import * as ApiHelper from'./apiHelper'
import './style.css'

let appState : IAppState = {
    name : 'DeezerAPG',
    loginStatus : {
        isLogged : false,
        code : ''
    }
}

let loginSection : HTMLElement | null
let loginWindow : Window | null

window.addEventListener("message", (event) => {
    // Skip if the message is not from us
    if (event.origin !== window.location.origin || event.data.name !== appState.name) return
    else if(!appState.loginStatus.isLogged) loginMessageHandler(event)
})

document.addEventListener('DOMContentLoaded', () => {
    loginSection = document.querySelector<HTMLElement>('section.login')
    if (loginSection) initLoginSection()
})

/**
 * Handles the message events between the main and login window
 *
 * @param {MessageEvent<any>} event
 * @return {void}
 */
function loginMessageHandler(event : MessageEvent<any>) : void {
    if (!event.data.loginStatus.isLogged) {
        let code : string | null = Utils.checkQueryParams('code')
        if (code) {
            appState.loginStatus.code = code;
            appState.loginStatus.isLogged = true;
            // @ts-ignore
            event.source.postMessage(appState, event.origin)
        }
    } else {
        appState.loginStatus = event.data.loginStatus
        if (loginSection) updateLoginSection()
    }
}

/**
 * Handles the login step
 * Checks if the user is logged in or if there are query parameters with code
 *
 * @return {void}
 */
function initLoginSection() : void {
    if (Utils.checkQueryParams('code')) {
        loginSection!.innerHTML = `
                <p style="margin: 0">Connected.. redirection in 2s</p>
            `
    } else {
        const loginButton : HTMLAnchorElement | null = loginSection!.querySelector<HTMLAnchorElement>('.dz-login')
        loginButton?.addEventListener('click', () => {
            loginWindow = ApiHelper.openLoginWindow(loginWindow)
            checkLoginStatus()
        })
    }
}

/**
 * Checks the login status using a timer
 *
 * @returns {void}
 */
function checkLoginStatus() : void {
    let checkingStatus : number = setInterval(() => {
        if (appState.loginStatus.isLogged) clearInterval(checkingStatus)
        else loginWindow?.postMessage(appState, window.location.origin)
    }, 2500)
}

/**
 * Updates the login section with the user data
 * and sets the logout button action
 *
 * @returns {void}
 */
function updateLoginSection () : void {
    loginWindow?.close()
    ApiHelper.getUserData(appState.loginStatus.code).then(userData => {
        console.log(userData)
        loginSection!.innerHTML = `
                    <p>Great ${userData.firstname} ! You are logged in.</p>
                    <a href="#" class="btn" onClick="window.location.reload()">Logout</a>
                `
    })
}