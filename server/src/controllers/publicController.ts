import type { Request, Response } from 'express';
import { all, collection, insert, noId, one } from '../config/db.ts';
import type { MetaTag, Setting } from '../types.ts';
import { notifyAdmin } from '../utils/mailer.ts';
import { escapeHtml, now } from '../utils/http.ts';
import { validate } from '../utils/validate.ts';

export async function home(_req: Request, res: Response) {
    const [testimonials, leftMarquee, rightMarquee] = await Promise.all([
        all('testimonial'),
        all('logoSlider', { direction: 'left' }, { id: -1 }),
        all('logoSlider', { direction: 'right' }, { id: -1 }),
    ]);
    res.json({ testimonials, leftMarquee, rightMarquee });
}

export async function about(_req: Request, res: Response) {
    const [testimonials, services] = await Promise.all([
        all('testimonial'),
        all('services', {}, { id: -1 }),
    ]);
    res.json({ testimonials, services });
}

export async function services(_req: Request, res: Response) {
    res.json({ services: await all('services') });
}

export async function webDevelopment(_req: Request, res: Response) {
    const [webServices, webTechnologies] = await Promise.all([all('webServices'), all('webTechnology')]);
    res.json({ webServices, webTechnologies });
}

export async function projects(_req: Request, res: Response) {
    // Inner join: projects whose category no longer exists are left out.
    const rows = await (await collection('projects'))
        .aggregate([
            { $sort: { id: -1 } },
            { $lookup: { from: 'project_category', localField: 'category', foreignField: 'id', as: 'cat' } },
            { $unwind: '$cat' },
            { $set: { category_name: '$cat.category_name', category_id: '$cat.id' } },
            { $project: { ...noId, cat: 0 } },
        ])
        .toArray();
    res.json({ projects: rows });
}

export async function blog(_req: Request, res: Response) {
    res.json({ blog: await all('blog') });
}

export async function privacyPolicy(_req: Request, res: Response) {
    res.json({ policy: await one('policy', { id: 1 }) });
}

/** Footer social links from Admin > Settings. */
export async function site(_req: Request, res: Response) {
    const s = await one<Setting>('setting', { id: 1 }, { facebook: 1, instagram: 1 });
    res.json({
        social: {
            facebook: s?.facebook && s.facebook !== 'N/A' ? s.facebook : '#',
            instagram: s?.instagram || '#',
        },
    });
}

export async function metaForPath(path: unknown): Promise<MetaTag | null> {
    const clean = '/' + String(path ?? '/').replace(/^\/+|\/+$/g, '');
    try {
        return await one<MetaTag>(
            'meta_tags',
            { page_path: clean, is_active: true },
            { meta_title: 1, meta_description: 1, meta_keywords: 1, robots: 1, canonical_url: 1 },
        );
    } catch {
        return null;
    }
}

export async function meta(req: Request, res: Response) {
    res.json({ meta: await metaForPath(req.query.path) });
}

export async function contact(req: Request, res: Response) {
    const d = validate(req.body, {
        contact_name: { label: 'name', required: true, max: 255 },
        contact_email: { label: 'email', required: true, type: 'email', max: 255 },
        contact_phone: { label: 'phone', required: true, max: 20, pattern: /^[0-9+\-\s]+$/ },
        contact_subject: { label: 'subject', required: true, max: 255 },
        contact_message: { label: 'message', required: true, max: 1000 },
    });

    const stamp = now();
    await insert('contact', {
        name: d.contact_name,
        email: d.contact_email,
        phone: d.contact_phone,
        subject: d.contact_subject,
        message: d.contact_message,
        created_at: stamp,
        updated_at: stamp,
    });

    await notifyAdmin(
        `New Contact Enquiry: ${d.contact_subject}`,
        'Hello Admin,<br><br>A new enquiry has been submitted.<br><br>' +
            `<strong>Name:</strong> ${escapeHtml(d.contact_name)}<br>` +
            `<strong>Email:</strong> ${escapeHtml(d.contact_email)}<br>` +
            `<strong>Phone:</strong> ${escapeHtml(d.contact_phone)}<br>` +
            `<strong>Subject:</strong> ${escapeHtml(d.contact_subject)}<br>` +
            `<strong>Message:</strong> ${escapeHtml(d.contact_message)}<br><br>Regards,<br>Codes Experts`,
    );
    res.json({ message: 'Your Request submitted successfully!' });
}

export async function subscribe(req: Request, res: Response) {
    const d = validate(req.body, { email: { required: true, type: 'email', max: 255 } });
    const stamp = now();
    await insert('subscribe', { email: d.email, created_at: stamp, updated_at: stamp });
    await notifyAdmin(
        'New Subscribe Enquiry',
        `Hello Admin,<br><br>A new subscribe enquiry has been submitted.<br><br><strong>Email:</strong> ${escapeHtml(d.email)}<br>Regards,<br>Codes Experts`,
    );
    res.json({ message: 'Thank you for subscribing!' });
}
