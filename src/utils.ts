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

/**
 * Converts a 2-dimensional array to a CSV string
 *
 * @param {string[][]} data
 * @returns {string}
 */
export function arrayToCsv (data : string[][]) : string
{
    const csvData = data.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvData], { type: 'text/csv' })
    // URL.revokeObjectURL(downloadUrl)
    return URL.createObjectURL(blob)
}