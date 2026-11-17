import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { env } from '../config/env.ts';

export type FieldErrors = Record<string, string[]>;

export class HttpError extends Error {
    status: number;
    errors?: FieldErrors;

    constructor(status: number, message: string, errors?: FieldErrors) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
}

export const notFound = (what = 'Record') => new HttpError(404, `${what} not found.`);

/** Laravel-style 422 response: { message, errors: { field: [msg] } } */
export function validationError(errors: FieldErrors): HttpError {
    const messages = Object.values(errors).flat();
    const more = messages.length - 1;
    const extra = more > 0 ? ` (and ${more} more error${more > 1 ? 's' : ''})` : '';
    return new HttpError(422, `${messages[0]}${extra}`, errors);
}

/** Wrap async route handlers so rejected promises reach the error handler. */
export const handle =
    (fn: (req: Request, res: Response, next: NextFunction) => unknown): RequestHandler =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

/** Current time as "YYYY-MM-DD HH:mm:ss" in the site's timezone (matches existing rows). */
export function now(): string {
    const parts = Object.fromEntries(
        new Intl.DateTimeFormat('en-GB', {
            timeZone: env.timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23',
        })
            .formatToParts(new Date())
            .map((p) => [p.type, p.value]),
    );
    return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escapeHtml = (s: unknown): string => String(s ?? '').replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
