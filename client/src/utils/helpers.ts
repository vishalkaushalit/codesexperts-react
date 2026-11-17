/** Join class names, skipping falsy values. */
export const cn = (...classes: Array<string | false | null | undefined>): string => classes.filter(Boolean).join(' ');

/** Static file from client/public, e.g. publicAsset('assets/images/logo.webp'). */
export const publicAsset = (path: string): string => `/${path.replace(/^\/+/, '')}`;

/** Uploaded image whose path is stored in the DB, e.g. "projectImages/a.webp". */
export function uploadUrl(path: string | null | undefined): string {
    if (!path) return '';
    if (/^(https?:)?\/\//.test(path) || path.startsWith('data:') || path.startsWith('blob:')) return path;
    return `/uploads/${path.replace(/^\/+/, '')}`;
}

/** Plain text from admin-entered HTML (like PHP strip_tags). */
export function stripTags(html: unknown): string {
    if (!html) return '';
    return new DOMParser().parseFromString(String(html), 'text/html').body.textContent ?? '';
}

export const truncate = (text: string, max = 80): string => (text.length > max ? `${text.slice(0, max)}…` : text);

/** "2026-08-12 13:57:16" -> "12-08-2026 01:57 PM" (same format the Laravel admin used). */
export function formatDate(value: unknown): string {
    if (!value) return '';
    const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
    if (!m) return String(value);
    const [, y, mo, d, h, mi] = m;
    const hour = Number(h) % 12 || 12;
    return `${d}-${mo}-${y} ${String(hour).padStart(2, '0')}:${mi} ${Number(h) < 12 ? 'AM' : 'PM'}`;
}
