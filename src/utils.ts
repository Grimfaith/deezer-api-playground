/**
 * Checks if the given key exists in the query parameters of the current URL
 *
 * @param {string} key
 * @returns {(string|null)}
 */
export function checkQueryParams (key : string) : string | null {
    let qParams : URLSearchParams = new URLSearchParams(window.location.search)
    if (qParams.has(key)) return qParams.get(key)
    else return null
}