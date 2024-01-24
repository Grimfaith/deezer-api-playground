/**
 * Checks if the given key exists in the query parameters of the current URL
 *
 * @param {string} key
 * @returns {(string|null)}
 */
export function checkQueryParams (key : string) : string | null {
    let params : URLSearchParams = new URLSearchParams(window.location.search)
    return params.get(key)
}