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

let profilSection : HTMLElement | null
let loginWindow : Window | null

window.addEventListener("message", (event) => {
    // Skip if the message is not from us
    if (event.origin !== window.location.origin || event.data.name !== appState.name) return
    else if(!appState.loginStatus.isLogged) loginMessageHandler(event)
})

document.addEventListener('DOMContentLoaded', () => {
    profilSection = document.querySelector<HTMLElement>('section.profile')
    if (profilSection) initLoginSection()
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
        if (profilSection) updateLoginSection().then(() => loginWindow?.close())
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
        profilSection!.innerHTML = `
                <p style="margin: 0">Connected.. redirection in 2s</p>
            `
    } else {
        const loginButton : HTMLAnchorElement | null = profilSection!.querySelector<HTMLAnchorElement>('.dz-login')
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
async function updateLoginSection () : Promise<void> {
    let userData : IUserProfile | null = await ApiHelper.getUserData(appState.loginStatus.code)
    if (userData) {
        profilSection!.innerHTML = `
            <div class="profile-pic">
                <img src="${userData.picture}" alt="profile picture">
            </div>
            <p>Great ${userData.firstname} ! You are logged in.</p>
            <a href="#" class="btn" onClick="window.location.reload()">Logout</a>
        `
    } else console.log(`Something went wrong, unable to fetch user's datas`)
}