import * as Utils from'./utils'
import * as ApiHelper from'./apiHelper'
import './style.css'

let appLoginStatus : IWindowMessage = {
    originName : 'DeezerAPG',
    type : 'loginStatus',
    message : {
        isLogged : false,
        code : "null"
    }
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
            let code : string | null = Utils.checkQueryParams('code')
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
    const loginSection : HTMLElement | null = document.querySelector<HTMLElement>('section.login')
    if (loginSection) {
        if (appLoginStatus.message.isLogged) {
            ApiHelper.getUserData(appLoginStatus.message.code).then(userData => {
                console.log(userData)
                loginSection.innerHTML = `
                    <p>Great ${userData.firstname} ! you are logged in.</p>
                    <a href="#" class="btn" onClick="window.location.reload()">Logout</a>
                `
            })
        } else if (Utils.checkQueryParams('code')) {
            loginSection.innerHTML = `
                <p style="margin: 0">Connected.. redirection in 2s</p>
            `
        } else {
            const loginButton : HTMLAnchorElement | null = loginSection.querySelector<HTMLAnchorElement>('.dz-login')
            loginButton?.addEventListener('click', () => {
                loginWindow = ApiHelper.openLoginWindow(loginWindow)
                checkLoginStatus()
            })
        }
    }
}

/**
 * Checks the login status using a timer
 *
 * @returns {void}
 */
function checkLoginStatus() : void {
    let checkingStatus : number = setInterval(() => {
        if (appLoginStatus.message.isLogged) clearInterval(checkingStatus)
        else loginWindow?.postMessage(appLoginStatus, window.location.origin)
    }, 2500)
}