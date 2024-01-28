interface IAppState {
    name: 'DeezerAPG'
    loginStatus: {
        isLogged: boolean,
        code: string,
        access_token: string
    }
}

interface IUserProfile {
    id: number,
    name: string,
    lastname: string,
    firstname: string,
    email: string,
    status: number,
    birthday: string,
    inscription_date: string,
    gender: string,
    link: string,
    picture: string,
    picture_small: string,
    picture_medium: string,
    picture_big: string,
    picture_xl: string,
    country: string,
    lang: string,
    is_kid: boolean,
    explicit_content_level: string,
    explicit_content_levels_available: string[],
    tracklist: string
}

interface IUserFlowTrack {
    id: number,
    readable: boolean,
    title: string,
    title_short: string,
    title_version: string,
    duration: number,
    rank: string,
    explicit_lyrics: boolean,
    preview: string,
    artist: object,
    album: {
        id: number,
        title: string
        cover: string,
        cover_small: string,
        cover_medium: string,
        cover_big: string,
        cover_xl: string,
        md5_image: string,
        type: "album",
        tracklist: string
    }
}

interface IUserPlaylist {
    id: number,
    title: string,
    duration: number,
    public: boolean,
    is_love_track: boolean,
    collaborative: boolean,
    nb_tracks: number,
    fans: number,
    link: string,
    picture: string,
    picture_small: string,
    picture_medium: string,
    picture_big: string,
    picture_xl: string,
    checksum: string,
    time_add: string,
    time_mod: string,
    creator: {
        id: number,
        name: string
        tracklist: string,
        type: "user"
    }
}