import path from 'node:path';
import multer from 'multer';
import { del, put } from '@vercel/blob';
import { env } from '../config/env.ts';
import { HttpError } from './http.ts';

// Vercel functions reject request bodies over 4.5 MB, so uploads stay below that.
const MAX_SIZE = 4 * 1024 * 1024; // 4 MB

const TYPES: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
};

/** Multer instance that keeps the file in memory; saveUpload() stores it after validation passes. */
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_SIZE, files: 1 },
});

/** Validate an uploaded image; returns an error message or null. */
export function checkImage(file: Express.Multer.File | undefined, { allowSvg = false } = {}): string | null {
    if (!file) return null;
    const ext = TYPES[file.mimetype];
    if (!ext || (ext === 'svg' && !allowSvg)) {
        return `The image field must be a file of type: jpeg, png, jpg, webp${allowSvg ? ', svg' : ''}.`;
    }
    return null;
}

/** Store in Vercel Blob under <dir>/<timestamp>_<safe-name>-<random>.<ext>; returns the public URL saved in the DB. */
export async function saveUpload(file: Express.Multer.File, dir: string): Promise<string> {
    if (!env.blobToken) throw new HttpError(500, 'Image uploads need BLOB_READ_WRITE_TOKEN (see server/.env.example).');
    const ext = TYPES[file.mimetype];
    const base =
        path
            .parse(file.originalname)
            .name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 60) || 'image';
    const blob = await put(`${dir}/${Math.floor(Date.now() / 1000)}_${base}.${ext}`, file.buffer, {
        access: 'public',
        contentType: file.mimetype,
        addRandomSuffix: true,
    });
    return blob.url;
}

/** Delete a previously uploaded image. Only Vercel Blob URLs are touched; failures are logged, not thrown. */
export async function deleteUpload(stored: unknown): Promise<void> {
    if (typeof stored !== 'string' || !/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(stored)) return;
    try {
        await del(stored);
    } catch (err) {
        console.error('Could not delete blob', stored, err);
    }
}
