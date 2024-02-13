/*
    name: String
    return: String
*/
export function sanitize(text: string): string {
    return `${text}`
    .replace('_', '\\_')
    .replace('*', '\\*')
    .replace('|', '\\|')
}