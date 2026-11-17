import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { one } from '../config/db.ts';
import { env, isProduction } from '../config/env.ts';
import type { User } from '../types.ts';
import { HttpError } from '../utils/http.ts';

export const COOKIE = 'ce_session';

interface SessionPayload {
    sub: number;
    pw: string;
}

/** Changes whenever the password changes, so old sessions stop working after a password change. */
const fingerprint = (passwordHash: string) => crypto.createHash('sha256').update(passwordHash).digest('hex').slice(0, 16);

export function startSession(res: Response, user: Pick<User, 'id' | 'password'>, remember: boolean): void {
    const maxAge = (remember ? 30 : 1) * 24 * 60 * 60 * 1000;
    const payload: SessionPayload = { sub: user.id, pw: fingerprint(user.password) };
    const token = jwt.sign(payload, env.jwtSecret, { expiresIn: maxAge / 1000 });
    res.cookie(COOKIE, token, {
        httpOnly: true,
        sameSite: 'strict', // never sent on cross-site requests, which also blocks CSRF
        secure: isProduction,
        maxAge,
        path: '/',
    });
}

export function endSession(res: Response): void {
    res.clearCookie(COOKIE, { path: '/' });
}

function readToken(token: string): SessionPayload | null {
    try {
        const payload = jwt.verify(token, env.jwtSecret);
        return typeof payload === 'object' && typeof payload.sub === 'number' ? (payload as unknown as SessionPayload) : null;
    } catch {
        return null;
    }
}

/** Requires a logged-in admin; sets req.user. */
export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
        const token: unknown = req.cookies?.[COOKIE];
        const payload = typeof token === 'string' ? readToken(token) : null;
        if (!payload) throw new HttpError(401, 'Unauthenticated.');

        const user = await one<User>('users', { id: payload.sub }, { id: 1, name: 1, email: 1, password: 1 });
        if (!user || payload.pw !== fingerprint(user.password)) throw new HttpError(401, 'Unauthenticated.');
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
}

/** For handlers behind requireAuth. */
export function currentUser(req: Request): User {
    if (!req.user) throw new HttpError(401, 'Unauthenticated.');
    return req.user;
}
