/**
 * One-time copy of the MySQL data into MongoDB.
 *
 *   npm run migrate:mongo              # refuses to touch collections that already have data
 *   npm run migrate:mongo -- --replace # empties those collections first
 *
 * Reads MySQL from MYSQL_HOST / MYSQL_PORT / MYSQL_DATABASE / MYSQL_USER / MYSQL_PASSWORD
 * and writes to MONGODB_URI / MONGODB_DB (all from server/.env).
 */
import mysql from 'mysql2/promise';
import { MongoClient, type Document } from 'mongodb';

const e = process.env;
const replace = process.argv.includes('--replace');

/** Tables the app uses. Laravel's internal tables (cache, jobs, sessions, migrations…) are skipped. */
const TABLES = [
    'users',
    'setting',
    'meta_tags',
    'policy',
    'project_category',
    'projects',
    'services',
    'webServices',
    'webTechnology',
    'testimonial',
    'logoSlider',
    'blog',
    'contact',
    'subscribe',
];

/** Column type fixes: MySQL stored these as text / tinyint. */
function convert(table: string, row: Document): Document {
    const doc = { ...row };
    if (table === 'projects' && doc.category != null) doc.category = Number(doc.category);
    if (table === 'meta_tags') doc.is_active = Boolean(Number(doc.is_active));
    return doc;
}

const INDEXES: Record<string, Array<{ key: Document; unique?: boolean }>> = {
    users: [{ key: { email: 1 }, unique: true }],
    meta_tags: [{ key: { page_path: 1 }, unique: true }],
    services: [{ key: { slug: 1 }, unique: true }],
    projects: [{ key: { category: 1 } }],
    logoSlider: [{ key: { direction: 1 } }],
};

if (!e.MONGODB_URI) throw new Error('Set MONGODB_URI in server/.env first.');

const sql = await mysql.createConnection({
    host: e.MYSQL_HOST ?? '127.0.0.1',
    port: Number(e.MYSQL_PORT ?? 3306),
    database: e.MYSQL_DATABASE ?? 'codesexperts-react-db',
    user: e.MYSQL_USER ?? 'root',
    password: e.MYSQL_PASSWORD ?? '',
    dateStrings: true, // keep dates as "YYYY-MM-DD HH:mm:ss", the format the API returns
});
const mongo = await new MongoClient(e.MONGODB_URI).connect();
const db = mongo.db(e.MONGODB_DB ?? 'codesexperts-react-db');

try {
    // Check everything before writing anything.
    if (!replace) {
        for (const table of TABLES) {
            if (await db.collection(table).estimatedDocumentCount()) {
                throw new Error(`Collection "${table}" already has data. Re-run with --replace to overwrite.`);
            }
        }
    }

    for (const table of TABLES) {
        const [rows] = await sql.query<mysql.RowDataPacket[]>(`SELECT * FROM ${mysql.escapeId(table)} ORDER BY id`);
        const docs = rows.map((r) => convert(table, r));
        const col = db.collection(table);

        await col.deleteMany({});
        if (docs.length) await col.insertMany(docs);
        await col.createIndex({ id: 1 }, { unique: true });
        for (const ix of INDEXES[table] ?? []) await col.createIndex(ix.key, { unique: ix.unique ?? false });

        // New documents continue numbering after the highest existing id (like AUTO_INCREMENT).
        const maxId = docs.reduce((m, d) => Math.max(m, Number(d.id) || 0), 0);
        await db.collection<{ _id: string; seq: number }>('counters').updateOne({ _id: table }, { $set: { seq: maxId } }, { upsert: true });

        console.log(`${table.padEnd(18)} ${String(docs.length).padStart(4)} documents`);
    }
    console.log(`\nDone. Data is in MongoDB database "${db.databaseName}".`);
} finally {
    await sql.end();
    await mongo.close();
}
