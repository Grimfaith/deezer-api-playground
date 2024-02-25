import * as Utils from'./utils'
import * as ApiHelper from'./apiHelper'
import '@fortawesome/fontawesome-free/css/all.css'
import './style.css'
import excelSvg from './img/excel.svg?raw'

let appState : IAppState = {
    name : 'DeezerAPG',
    loginStatus : {
        isLogged : false,
        code : null,
        token : {access_token: '', expires: 0}
    }
}

let mainSection : HTMLElement | null
let profileSection : HTMLElement | null
let flowSection : HTMLElement | null
let loginWindow : Window | null

window.addEventListener("message", (event) => {
    // Skip if the message is not from us
    if (event.origin !== window.location.origin || event.data.name !== appState.name) return
    else if(!appState.loginStatus.isLogged) loginMessageHandler(event)
})

document.addEventListener('DOMContentLoaded', () => {
    mainSection = document.createElement('main')
    mainSection.innerHTML = `<h1><strong>Deezer</strong> API Playground</h1>`
    document.body.appendChild(mainSection)

    initProfileSection()
})

/**
 * Handles the message events between the main and login window
 *
 * @param {MessageEvent<any>} event
 * @return {void}
 */
function loginMessageHandler(event : MessageEvent<any>) : void {
    if (!event.data.loginStatus.isLogged) {
        let code = Utils.checkQueryParams('code')
        if (code) {
            ApiHelper.generateAccessToken(code).then(token => {
                if (token) {
                    appState.loginStatus.isLogged = true
                    appState.loginStatus.code = code
                    appState.loginStatus.token = token
                    // @ts-ignore
                    event.source.postMessage(appState, event.origin)
                } else console.log('Failed to get access token with code ' + code)
            })
        }
    } else {
        appState.loginStatus = event.data.loginStatus
        updateProfileSection(appState.loginStatus.token.access_token)
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
        mainSection!.innerHTML = `
                <h1><strong>Deezer</strong> API Playground</h1>
                <section class="profile">
                    <p style="margin: 0">Connected.. redirection in 2s</p>
                </section>
            `
    } else {
        profileSection = document.createElement('section')
        profileSection.classList.add('profile')
        profileSection.innerHTML = `
            <p>Start by log in</p>
            <div class="profile-btn">
                <a href="#" class="btn dz-login">Login</a>
            </div>
        `
        mainSection?.appendChild(profileSection)

        const loginButton = profileSection.querySelector<HTMLAnchorElement>('.dz-login')
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
    let checkingStatus = setInterval(() => {
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
function updateProfileSection (access_token: string) : void {
    ApiHelper.getUserData(access_token).then(userData => {
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

            const flowButton = profileSection!.querySelector<HTMLAnchorElement>('.dz-flow')
            flowButton?.addEventListener('click', () => {
                if (flowSection!.style.display === 'none') {
                    flowSection!.style.display = 'grid'
                    flowButton.innerText = 'Hide Flow'
                } else {
                    flowSection!.style.display = 'none'
                    flowButton.innerText = 'Display Flow'
                }
            })

            initUserFlow(userData.id)
            initUserPlaylists(access_token)

        } else console.log(`Something went wrong, unable to fetch user's data`)
    })

    loginWindow?.close()
}

/**
 * Initializes the user flow
 *
 * @param {number} userID
 * @return {void}
 */
function initUserFlow(userID: number) : void {
    ApiHelper.getUserFlow(userID).then(flowData => {
        if (flowData) {
            flowSection = document.createElement('section')
            flowSection.classList.add('flow-container')

            const flowText = document.createElement('p')
            flowText.append('Here\'s some tracks from your Deezer flow')

            const shuffleFlowBtn = document.createElement('a')
            shuffleFlowBtn.classList.add('btn')
            shuffleFlowBtn.innerText = 'Shuffle'

            const flowTracks = document.createElement('div')
            flowTracks.classList.add('flow-tracks')

            for (let i = 0; i < 3; i++) {
                // @ts-ignore
                const flowTrack = flowData[i]
                const trackElement = document.createElement('div')
                trackElement.classList.add('flow-track')

                trackElement.innerHTML = `
                    <img src="${flowTrack.album.cover_medium}" alt="album cover">
                    <audio controls src="${flowTrack.preview}"></audio>
                `
                flowTracks.appendChild(trackElement);
            }

            shuffleFlowBtn.addEventListener('click', () => {
                flowSection?.remove()
                initUserFlow(userID)
            })

            flowSection.appendChild(flowText)
            flowSection.appendChild(flowTracks)
            flowSection.appendChild(shuffleFlowBtn)
            mainSection?.insertBefore(flowSection, profileSection!.nextSibling)

        } else console.log(`Something went wrong, unable to fetch user's flow data`);
    })
}

/**
 * Initializes user playlists section and renders them on the page.
 *
 * @param {string} access_token
 * @returns {void}
 */
function initUserPlaylists(access_token: string) : void {
    ApiHelper.getUserPlaylists(access_token).then(data => {
        if (data) {
            const playlistsSection = document.createElement('section')
            playlistsSection.classList.add('playlists-container')

            const playlistsText = document.createElement('p')
            playlistsText.append('And here\'s your playlists')

            const playlists = document.createElement('div')
            playlists.classList.add('playlists')

            data.forEach(async playlist => {
                const playlistTracks = await ApiHelper.getPlaylistTracks(access_token, playlist.id)
                const tracklist = [['Title', 'Artist', 'Album', 'Link']]

                playlistTracks?.forEach(track => {
                    tracklist.push([
                        track.title.replace(/,/g, " "),
                        track.artist.name.replace(/,/g, " "),
                        track.album.title.replace(/,/g, " "),
                        track.link
                    ])
                })

                const playlistElement = createPlaylistElement(playlist, tracklist)
                playlists.append(playlistElement)
            })

            playlistsSection.append(playlistsText)
            playlistsSection.append(playlists)
            mainSection?.append(playlistsSection)
        }
    })
}

/**
 * Creates a playlist HTML element based on the provided playlist and tracklist
 *
 * @param {IPlaylist} playlist
 * @param {string[][]} tracklist
 * @return {HTMLElement}
 */
function createPlaylistElement(playlist: IPlaylist, tracklist: string[][]) : HTMLElement {
    const exportFileName = `${playlist.title}-by-${playlist.creator.name}`
    const playlistElement = document.createElement('div')

    playlistElement.classList.add('playlist')
    playlistElement.innerHTML = `
        <div class="title">${playlist.title}</div>
        <div class="nb-tracks">${playlist.nb_tracks} tracks</div>
    `

    const playListButtons = document.createElement('div')
    playListButtons.classList.add("buttons")

    const openInDzBtn = document.createElement("a")
    openInDzBtn.innerHTML = '<i class="fa-solid fa-square-up-right"></i>'
    openInDzBtn.title = "Open in Deezer"
    openInDzBtn.target = "_blank"
    openInDzBtn.href = playlist.link

    const csvDlBtn = document.createElement("a")
    csvDlBtn.innerHTML = '<i class="fa-solid fa-file-csv"></i>'
    csvDlBtn.title = "Export to CSV"
    csvDlBtn.download = `${exportFileName}.csv`
    csvDlBtn.href = Utils.arrayToCsv(tracklist)

    const xlsxDlBtn = document.createElement("a")
    xlsxDlBtn.innerHTML = excelSvg;
    xlsxDlBtn.title = "Export to Excel"
    xlsxDlBtn.addEventListener('click', function () {
        Utils.arrayToExcel(tracklist, exportFileName)
    })

    playListButtons.append(openInDzBtn, csvDlBtn, xlsxDlBtn)
    playlistElement.append(playListButtons)

    return playlistElement
}