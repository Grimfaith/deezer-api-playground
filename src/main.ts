import './style.css'
import app_config from './app_config.env.json'

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector<HTMLAnchorElement>('.dz-login')
    if (loginButton) loginButton.addEventListener('click', openDeezerLoginTab)
})

// Opens a new tab allowing the user
// to enable the application using their Deezer account
let deezerLoginWindow: Window | null = null
function openDeezerLoginTab() : void {
    const authEndpoint = new URL(`${window.location}dz-login`);
    authEndpoint.searchParams.set("app_id", app_config.deezer.app_id);
    authEndpoint.searchParams.set("redirect_uri", window.location.origin);

    if (deezerLoginWindow === null || deezerLoginWindow.closed) {
        deezerLoginWindow = window.open(authEndpoint.toString(), 'DeezerLoginWindow');
    } else {
        deezerLoginWindow.focus();
    }
}