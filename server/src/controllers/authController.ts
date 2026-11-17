import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { collection, one } from '../config/db.ts';
import { currentUser, endSession, startSession } from '../middleware/auth.ts';
import type { User } from '../types.ts';
import { now, validationError } from '../utils/http.ts';
import { validate } from '../utils/validate.ts';

const publicUser = ({ id, name, email }: Pick<User, 'id' | 'name' | 'email'>) => ({ id, name, email });

// Laravel stored bcrypt hashes with the "$2y$" prefix; it is the same algorithm as "$2b$".
const checkPassword = (plain: string, hash: string) => bcrypt.compare(plain, hash.replace(/^\$2y\$/, '$2b$'));

export async function login(req: Request, res: Response) {
    const data = validate(req.body, {
        email: { required: true, type: 'email' },
        password: { required: true },
    });
    const user = await one<User>('users', { email: data.email }, { id: 1, name: 1, email: 1, password: 1 });
    if (!user || !(await checkPassword(String(data.password), user.password))) {
        throw validationError({ email: ['These credentials do not match our records.'] });
    }
    startSession(res, user, Boolean((req.body as { remember?: unknown } | undefined)?.remember));
    res.json({ user: publicUser(user) });
}

export function logout(_req: Request, res: Response) {
    endSession(res);
    res.json({ message: 'Logged out.' });
}

export function me(req: Request, res: Response) {
    res.json({ user: publicUser(currentUser(req)) });
}

export async function updateProfile(req: Request, res: Response) {
    const user = currentUser(req);
    const data = validate(req.body, {
        name: { required: true, max: 255 },
        email: { required: true, type: 'email', max: 255 },
    });
    const taken = await one('users', { email: data.email, id: { $ne: user.id } }, { id: 1 });
    if (taken) throw validationError({ email: ['The email has already been taken.'] });

    await (await collection('users')).updateOne({ id: user.id }, { $set: { name: data.name, email: data.email, updated_at: now() } });
    res.json({ message: 'Profile updated.', user: { id: user.id, name: data.name, email: data.email } });
}

export async function updatePassword(req: Request, res: Response) {
    const user = currentUser(req);
    const data = validate(req.body, {
        current_password: { label: 'current password', required: true },
        password: { label: 'password', required: true, min: 8, max: 255 },
        password_confirmation: { label: 'password confirmation', required: true },
    });
    if (!(await checkPassword(String(data.current_password), user.password))) {
        throw validationError({ current_password: ['The password is incorrect.'] });
    }
    if (data.password !== data.password_confirmation) {
        throw validationError({ password: ['The password field confirmation does not match.'] });
    }
    const hash = await bcrypt.hash(String(data.password), 12);
    await (await collection('users')).updateOne({ id: user.id }, { $set: { password: hash, updated_at: now() } });

    // Re-issue this session; other sessions stop working because the password fingerprint changed.
    startSession(res, { id: user.id, password: hash }, false);
    res.json({ message: 'Password updated.' });
}
