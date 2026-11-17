import type { Request, Response } from 'express';
import { collection, noId, one } from '../config/db.ts';
import type { Setting } from '../types.ts';
import { notFound, now } from '../utils/http.ts';
import { validate } from '../utils/validate.ts';

const count = async (name: string) => (await collection(name)).countDocuments();

export async function dashboard(_req: Request, res: Response) {
    const [services, projects, testimonials, enquiries, subscribers] = await Promise.all(
        ['services', 'projects', 'testimonial', 'contact', 'subscribe'].map(count),
    );
    const latestEnquiries = await (await collection('contact'))
        .find({}, { projection: { ...noId, id: 1, name: 1, email: 1, subject: 1, created_at: 1 } })
        .sort({ id: -1 })
        .limit(5)
        .toArray();
    res.json({ counts: { services, projects, testimonials, enquiries, subscribers }, latestEnquiries });
}

export async function getSettings(_req: Request, res: Response) {
    const setting = await one<Setting>('setting', { id: 1 });
    if (!setting) throw notFound('Settings');
    res.json({ data: setting });
}

export async function updateSettings(req: Request, res: Response) {
    const data = validate(req.body, {
        email: { required: true, type: 'email', max: 255 },
        phone: { required: true, pattern: /^[0-9]{10}$/, patternMessage: 'The phone field must be exactly 10 digits.' },
        address: { required: true, max: 2000 },
        facebook: { required: false, type: 'url', max: 255 },
        instagram: { required: false, type: 'url', max: 255 },
    });
    const result = await (await collection('setting')).updateOne({ id: 1 }, { $set: { ...data, updated_at: now() } });
    if (!result.matchedCount) throw notFound('Settings');
    res.json({ message: 'Settings updated successfully.', data: await one<Setting>('setting', { id: 1 }) });
}
