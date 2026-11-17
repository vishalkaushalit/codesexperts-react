import fs from 'node:fs/promises';
import path from 'node:path';
import multer from 'multer';
import { env } from '../config/env.ts';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const TYPES: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
};

/** Multer instance that keeps the file in memory; saveUpload() writes it after validation passes. */
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

/** Save to uploads/<dir>/<timestamp>_<safe-name>.<ext> and return the DB path ("dir/file.ext"). */
export async function saveUpload(file: Express.Multer.File, dir: string): Promise<string> {
    const ext = TYPES[file.mimetype];
    const base =
        path
            .parse(file.originalname)
            .name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 60) || 'image';
    const filename = `${Math.floor(Date.now() / 1000)}_${base}.${ext}`;
    const folder = path.join(env.uploadsDir, dir);
    await fs.mkdir(folder, { recursive: true });
    await fs.writeFile(path.join(folder, filename), file.buffer);
    return `${dir}/${filename}`;
}

/** Delete a previously uploaded file, refusing anything outside the uploads folder. */
export async function deleteUpload(dbPath: unknown): Promise<void> {
    if (typeof dbPath !== 'string' || !dbPath) return;
    const full = path.resolve(env.uploadsDir, dbPath);
    if (!full.startsWith(env.uploadsDir + path.sep)) return;
    await fs.rm(full, { force: true });
}
