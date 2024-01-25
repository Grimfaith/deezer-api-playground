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

let profileSection : HTMLElement | null
let flowSection : HTMLElement | null
let loginWindow : Window | null

window.addEventListener("message", (event) => {
    // Skip if the message is not from us
    if (event.origin !== window.location.origin || event.data.name !== appState.name) return
    else if(!appState.loginStatus.isLogged) loginMessageHandler(event)
})

document.addEventListener('DOMContentLoaded', () => {
    profileSection = document.querySelector<HTMLElement>('main section.profile')
    if (profileSection) initProfileSection()
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
        if (profileSection) updateProfileSection()
    }
}

/**
 * Handles the login step
 * Checks if the user is logged in or if there are query parameters with code
 *
 * @return {void}
 */
function initProfileSection() : void {
    if (Utils.checkQueryParams('code')) {
        profileSection!.innerHTML = `
                <p style="margin: 0">Connected.. redirection in 2s</p>
            `
    } else {
        const loginButton : HTMLAnchorElement | null = profileSection!.querySelector<HTMLAnchorElement>('.dz-login')
        loginButton!.addEventListener('click', () => {
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
 * and sets the logout and the flow button action
 *
 * @returns {void}
 */
function updateProfileSection () : void {
    ApiHelper.getUserData(appState.loginStatus.code).then(userData => {
        if (userData) {
            profileSection!.innerHTML = `
                <div class="profile-pic">
                    <img src="${userData.picture}" alt="profile picture">
                </div>
                <p>Great ${userData.firstname} ! You are logged in.</p>
                <div class="profile-btn">
                    <a href="#" class="btn" onClick="window.location.reload()">Logout</a>
                    <a href="#" class="btn dz-flow">Hide Flow</a>
                </div>
            `

            initUserFlow(userData.id)
            if (flowSection) {
                const flowButton : HTMLAnchorElement | null = profileSection!.querySelector<HTMLAnchorElement>('.dz-flow')
                flowButton?.addEventListener('click', () => {
                    if (flowSection!.style.display === 'none') {
                        flowSection!.style.display = 'grid'
                        flowButton.innerText = 'Hide Flow'
                    } else {
                        flowSection!.style.display = 'none'
                        flowButton.innerText = 'Display Flow'
                    }
                })
            }

        } else console.log(`Something went wrong, unable to fetch user's data`)
    })
    loginWindow?.close()
}

/**
 * Initializes the user flow
 *
 * @param {number} userID - The ID of the user.
 * @return {void}
 */
function initUserFlow(userID: number) : void {
    flowSection = document.querySelector<HTMLElement>('main section.flow-container')

    ApiHelper.getUserFlow(userID).then(flowData => {
        if (flowData && flowSection) {

            const flowText = document.createElement('p')
            flowText.append('Here\'s some tracks from your Deezer flow')

            const shuffleFlowBtn = document.createElement('a')
            shuffleFlowBtn.classList.add('btn')
            shuffleFlowBtn.innerText = 'Shuffle'

            const flowTracks = document.createElement('div')
            flowTracks.classList.add('flow-tracks')

            for (let i = 0; i < 3; i++) {
                // @ts-ignore
                const track = flowData.data[i]
                const trackElement = document.createElement('div')
                trackElement.classList.add('flow-track')

                trackElement.innerHTML = `
                    <img src="${track.album.cover_medium}" alt="album cover">
                    <audio controls src="${track.preview}"></audio>
                `
                flowTracks.appendChild(trackElement);
            }

            shuffleFlowBtn.addEventListener('click', () => {
                flowSection!.style.display = 'none'
                flowSection!.innerHTML = ''
                initUserFlow(userID)
            })

            flowSection.appendChild(flowText)
            flowSection.appendChild(flowTracks)
            flowSection.appendChild(shuffleFlowBtn)
            flowSection.style.display = 'grid'

        } else console.log(`Something went wrong, unable to fetch user's flow data`);
    })
}