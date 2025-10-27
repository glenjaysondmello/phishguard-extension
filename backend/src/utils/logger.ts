export function extractHostname(url: string) {
    try {
        const u = new URL(url);
        return u.hostname;
    } catch (error) {
        return '';
    }
}