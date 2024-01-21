import './style.css'
import app_config from './app_config.env.json'

// Redirect to Deezer's login page
// to authenticate user
function redirectToDeezerLogin() : void {
    const authEndpoint = new URL(`${window.location}dz-login`);
    authEndpoint.searchParams.set("app_id", app_config.deezer.app_id);
    authEndpoint.searchParams.set("redirect_uri", window.location.origin);

    window.location.replace(authEndpoint.toString());
}