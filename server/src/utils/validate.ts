import { HttpError, validationError, type FieldErrors } from './http.ts';

export interface Rule {
    label?: string;
    required?: boolean;
    type?: 'string' | 'email' | 'url' | 'boolean' | 'integer';
    max?: number;
    min?: number;
    in?: readonly string[];
    pattern?: RegExp;
    patternMessage?: string;
    /** Table whose `id` must contain this value (checked by the resource controller). */
    exists?: string;
}

export type Rules = Record<string, Rule>;
export type Clean = Record<string, string | number | boolean | null>;

/** Minimal Laravel-like validator. Returns cleaned data or throws a 422 HttpError. */
export function validate(body: unknown, rules: Rules): Clean {
    const input = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
    const data: Clean = {};
    const errors: FieldErrors = {};
    const fail = (field: string, msg: string) => (errors[field] ??= []).push(msg);

    for (const [field, rule] of Object.entries(rules)) {
        const label = rule.label ?? field.replace(/_/g, ' ');
        const raw = input[field];

        if (rule.type === 'boolean') {
            data[field] = raw === true || raw === 'true' || raw === '1' || raw === 1 || raw === 'on';
            continue;
        }

        const str = typeof raw === 'string' ? raw.trim() : raw == null ? '' : String(raw);
        if (str === '') {
            if (rule.required) fail(field, `The ${label} field is required.`);
            else data[field] = null;
            continue;
        }

        let value: string | number = str;
        if (rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
            fail(field, `The ${label} field must be a valid email address.`);
        }
        if (rule.type === 'url' && !isHttpUrl(str)) fail(field, `The ${label} field must be a valid URL.`);
        if (rule.type === 'integer') {
            if (!/^\d+$/.test(str)) fail(field, `The ${label} field must be an integer.`);
            else value = Number(str);
        }
        if (rule.in && !rule.in.includes(str)) fail(field, `The selected ${label} is invalid.`);
        if (rule.max && str.length > rule.max) fail(field, `The ${label} field must not be greater than ${rule.max} characters.`);
        if (rule.min && str.length < rule.min) fail(field, `The ${label} field must be at least ${rule.min} characters.`);
        if (rule.pattern && !rule.pattern.test(str)) fail(field, rule.patternMessage ?? `The ${label} field format is invalid.`);
        data[field] = value;
    }

    if (Object.keys(errors).length) throw validationError(errors);
    return data;
}

function isHttpUrl(value: string): boolean {
    try {
        return ['http:', 'https:'].includes(new URL(value).protocol);
    } catch {
        return false;
    }
}

export const isValidationError = (err: unknown): err is HttpError & { errors: FieldErrors } =>
    err instanceof HttpError && err.status === 422 && Boolean(err.errors);
