interface IAccess_Token {
    access_token: string,
    expires: number
}

interface IAppState {
    name: 'DeezerAPG'
    loginStatus: {
        isLogged: boolean,
        code: string | null
        token: IAccess_Token
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

interface ITrack {
    id: number,
    readable: boolean,
    title: string,
    title_short: string,
    title_version: string,
    unseen: boolean,
    isrc: string,
    link: string,
    share: string,
    duration: number,
    track_position: number,
    disk_position: number,
    rank: number,
    release_date: string,
    explicit_lyrics: boolean,
    explicit_content_lyrics: number,
    explicit_content_cover: number,
    preview: string,
    bpm: number,
    gain: number,
    available_countries: string[],
    alternative: ITrack,
    contributors: string[],
    md5_image: string,
    artist: IArtist,
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

interface IArtist {
    id: number,
    name: string,
    link: string,
    share: string,
    picture: string,
    picture_small: string,
    picture_medium: string,
    picture_big: string,
    picture_xl: string,
    nb_album: number,
    nb_fan: number,
    radio: boolean,
    tracklist: string,
}