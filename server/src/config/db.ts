import { MongoClient, type Collection, type Db, type Document, type Filter, type Sort } from 'mongodb';
import { env } from './env.ts';

/**
 * Each former MySQL table is a collection with the same name. Documents keep a numeric `id`
 * (unique index), so URLs and API responses look exactly as they did with MySQL.
 * Mongo's own `_id` is hidden from every read with the `noId` projection.
 */
export type Row = Document & { id: number };

let dbPromise: Promise<Db> | undefined;

/** Connect once and reuse the connection (also across warm serverless invocations). */
export function getDb(): Promise<Db> {
    dbPromise ??= new MongoClient(env.mongo.uri, { maxPoolSize: 10 })
        .connect()
        .then((client) => client.db(env.mongo.database))
        .catch((err: unknown) => {
            dbPromise = undefined; // retry on the next request instead of caching the failure
            throw err;
        });
    return dbPromise;
}

export async function collection<T extends Document = Row>(name: string): Promise<Collection<T>> {
    return (await getDb()).collection<T>(name);
}

/** Projection that leaves out Mongo's internal `_id`. */
export const noId = { _id: 0 } as const;

/** All matching documents (default order: by id, like MySQL's natural order). */
export async function all<T = Row>(name: string, filter: Filter<Document> = {}, sort: Sort = { id: 1 }): Promise<T[]> {
    return (await collection(name)).find(filter, { projection: noId }).sort(sort).toArray() as Promise<T[]>;
}

/** One matching document or null. */
export async function one<T = Row>(name: string, filter: Filter<Document>, projection: Document = noId): Promise<T | null> {
    return (await collection(name)).findOne(filter, { projection: { ...noId, ...projection } }) as Promise<T | null>;
}

/** Auto-increment replacement: the next numeric id for a collection, kept in `counters`. */
export async function nextId(name: string): Promise<number> {
    const counters = await collection<{ _id: string; seq: number }>('counters');
    const doc = await counters.findOneAndUpdate({ _id: name }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: 'after' });
    return doc!.seq;
}

/** Insert a document with the next id; returns that id. */
export async function insert(name: string, data: Document): Promise<number> {
    const id = await nextId(name);
    await (await collection(name)).insertOne({ id, ...data });
    return id;
}
