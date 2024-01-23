namespace DataTypes {
    interface UserProfile {
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
        explicit_content_level: boolean,
        explicit_content_levels_available: boolean,
        tracklist: string
    }
}