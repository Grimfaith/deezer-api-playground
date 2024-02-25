import * as XLSX from 'sheetjs';

/* load 'fs' for readFile and writeFile support */
import * as fs from 'fs';
XLSX.set_fs(fs);

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
export function arrayToCsv (data : string[][]) : string  {
    const csvData = data.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvData], { type: 'text/csv' })
    // URL.revokeObjectURL(downloadUrl)
    return URL.createObjectURL(blob)
}

export function arrayToExcel(data : string[][], sheetName: string) : void {
    const worksheet = XLSX.utils.aoa_to_sheet(data)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.writeFile(workbook, sheetName + ".xlsx", { compression: true })
}