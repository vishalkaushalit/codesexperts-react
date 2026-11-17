import type { Request, Response } from 'express';
import { all, collection, insert, noId, one, type Row } from '../config/db.ts';
import { resources, type ResourceDefinition } from '../resources/definitions.ts';
import { HttpError, notFound, now, validationError, type FieldErrors } from '../utils/http.ts';
import { checkImage, deleteUpload, saveUpload } from '../utils/uploads.ts';
import { isValidationError, validate, type Clean } from '../utils/validate.ts';

const PER_PAGE = 10;

type ResourceRequest = Request;

function definition(req: ResourceRequest): ResourceDefinition {
    const def = resources[String(req.params.resource)];
    if (!def) throw notFound('Resource');
    return def;
}

async function findRow(def: ResourceDefinition, rowId: unknown): Promise<Row> {
    const n = Number(rowId);
    const row = Number.isInteger(n) ? await one(def.table, { id: n }) : null;
    if (!row) throw notFound();
    return row;
}

/** Validate body + image and check unique / foreign-key rules. */
async function validated(def: ResourceDefinition, req: ResourceRequest, existing?: Row): Promise<Clean> {
    const fields = def.fields ?? {};
    const raw = (req.body ?? {}) as Record<string, unknown>;
    const body = def.prepare ? def.prepare(raw) : raw;
    const errors: FieldErrors = {};
    let data: Clean = {};

    try {
        data = validate(body, fields);
    } catch (err) {
        if (!isValidationError(err)) throw err;
        Object.assign(errors, err.errors);
    }

    if (def.image) {
        const msg = checkImage(req.file, def.image);
        if (msg) errors.image = [msg];
        else if (!req.file && !existing?.image && def.image.required) errors.image = ['The image field is required.'];
    }

    for (const [field, rule] of Object.entries(fields)) {
        if (rule.exists && data[field] != null) {
            const found = await one(rule.exists, { id: data[field] }, { id: 1 });
            if (!found) errors[field] = [`The selected ${rule.label} is invalid.`];
        }
    }
    for (const field of def.unique ?? []) {
        if (data[field] == null || errors[field]) continue;
        const dupe = await one(def.table, { [field]: data[field], id: { $ne: existing?.id ?? 0 } }, { id: 1 });
        if (dupe) errors[field] = [`The ${fields[field]?.label ?? field} has already been taken.`];
    }

    if (Object.keys(errors).length) throw validationError(errors);
    return data;
}

export async function list(req: ResourceRequest, res: Response) {
    const def = definition(req);
    const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10) || 1);
    const col = await collection(def.table);
    const total = await col.countDocuments();
    const rows = await col
        .aggregate([
            { $sort: def.sort },
            { $skip: (page - 1) * PER_PAGE },
            { $limit: PER_PAGE },
            ...(def.listStages ?? []),
            { $project: noId },
        ])
        .toArray();
    res.json({ data: rows, page, perPage: PER_PAGE, total, lastPage: Math.max(1, Math.ceil(total / PER_PAGE)) });
}

/** All rows, for select boxes (e.g. project categories). */
export async function options(req: ResourceRequest, res: Response) {
    const def = definition(req);
    res.json({ data: await all(def.table, {}, def.sort) });
}

export async function show(req: ResourceRequest, res: Response) {
    const def = definition(req);
    res.json({ data: await findRow(def, req.params.id) });
}

export async function create(req: ResourceRequest, res: Response) {
    const def = definition(req);
    if (def.readOnly) throw new HttpError(405, 'This resource is read-only.');
    const data = await validated(def, req);
    if (def.image && req.file) data.image = await saveUpload(req.file, def.image.dir);

    const stamp = now();
    const newId = await insert(def.table, { ...data, created_at: stamp, updated_at: stamp });
    res.status(201).json({ message: 'Saved successfully.', data: await findRow(def, newId) });
}

export async function update(req: ResourceRequest, res: Response) {
    const def = definition(req);
    if (def.readOnly) throw new HttpError(405, 'This resource is read-only.');
    const existing = await findRow(def, req.params.id);
    const data = await validated(def, req, existing);

    if (def.image && req.file) {
        data.image = await saveUpload(req.file, def.image.dir);
        await deleteUpload(existing.image);
    }
    await (await collection(def.table)).updateOne({ id: existing.id }, { $set: { ...data, updated_at: now() } });
    res.json({ message: 'Updated successfully.', data: await findRow(def, existing.id) });
}

export async function remove(req: ResourceRequest, res: Response) {
    const def = definition(req);
    const existing = await findRow(def, req.params.id);

    if (def.guardDelete) {
        const g = def.guardDelete;
        const n = await (await collection(g.table)).countDocuments({ [g.column]: existing.id });
        if (n > 0) throw new HttpError(409, g.message.replace('%d', String(n)));
    }

    await (await collection(def.table)).deleteOne({ id: existing.id });
    if (def.image) await deleteUpload(existing.image);
    res.json({ message: 'Deleted successfully.' });
}
