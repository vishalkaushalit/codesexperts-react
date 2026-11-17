/**
 * One-time copy of the images in server/uploads/ into Vercel Blob.
 * Every `image` field that still holds a local path ("projectImages/a.webp") is uploaded under the
 * same pathname and replaced with its Blob URL. Safe to run again: already-migrated rows are skipped.
 *
 *   npm --prefix server run migrate:blob
 *
 * Needs MONGODB_URI, MONGODB_DB and BLOB_READ_WRITE_TOKEN in server/.env.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { put } from '@vercel/blob';
import { MongoClient } from 'mongodb';
import { resources } from '../src/resources/definitions.ts';

const e = process.env;
if (!e.BLOB_READ_WRITE_TOKEN) throw new Error('Set BLOB_READ_WRITE_TOKEN in server/.env first.');

const uploadsDir = path.resolve(import.meta.dirname, '../uploads');
const TYPES: Record<string, string> = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const tables = [...new Set(Object.values(resources).filter((d) => d.image).map((d) => d.table))];

const client = await new MongoClient(e.MONGODB_URI || 'mongodb://127.0.0.1:27017').connect();
const db = client.db(e.MONGODB_DB || 'codesexperts-react-db');
let moved = 0;
let missing = 0;

for (const table of tables) {
    const rows = await db.collection(table).find({ image: { $type: 'string', $not: /^https?:\/\// } }).toArray();
    for (const row of rows) {
        const rel = String(row.image).replace(/^\/+/, '');
        const file = path.resolve(uploadsDir, rel);
        if (!file.startsWith(uploadsDir + path.sep)) continue;
        let body: Buffer;
        try {
            body = await fs.readFile(file);
        } catch {
            console.warn(`  missing file for ${table} #${row.id}: ${rel}`);
            missing++;
            continue;
        }
        const blob = await put(rel, body, {
            access: 'public',
            addRandomSuffix: false,
            allowOverwrite: true,
            contentType: TYPES[path.extname(rel).toLowerCase()],
        });
        await db.collection(table).updateOne({ _id: row._id }, { $set: { image: blob.url } });
        moved++;
    }
    console.log(`${table}: ${rows.length} row(s) checked`);
}

await client.close();
console.log(`Done: ${moved} image(s) moved to Vercel Blob, ${missing} missing.`);
