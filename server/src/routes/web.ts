import fs from 'node:fs';
import path from 'node:path';
import express, { Router } from 'express';
import { env } from '../config/env.ts';
import { metaForPath } from '../controllers/publicController.ts';
import { escapeHtml, handle } from '../utils/http.ts';

/** Public website paths (keep in sync with client/src/routes/AppRoutes.tsx). Used for the sitemap and 404 status. */
export const SITE_PATHS = [
    '/',
    '/about-us',
    '/services',
    '/services/web-development',
    '/services/digital-marketing',
    '/services/ui-ux-design',
    '/services/ecommerce-solutions',
    '/services/video-editing-and-motion-graphics',
    '/projects',
    '/contact',
    '/blog',
    '/privacy-policy',
    '/terms-and-conditions',
];

const router = Router();

router.get('/sitemap.xml', (_req, res) => {
    const urls = SITE_PATHS.map((p) => `  <url><loc>${escapeHtml(env.appUrl + (p === '/' ? '' : p))}</loc></url>`).join('\n');
    res.type('application/xml').send(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    );
});

// Old Laravel admin URLs
router.get(['/login', '/dashboard'], (_req, res) => res.redirect(301, '/admin'));

/**
 * Production: serve the built React app and inject per-page SEO meta (from the meta_tags table)
 * into index.html so search engines see it without running JavaScript.
 */
const indexFile = path.join(env.clientDist, 'index.html');
if (fs.existsSync(indexFile)) {
    router.use(express.static(env.clientDist, { index: false, maxAge: '7d' }));

    router.get(
        /.*/,
        handle(async (req, res) => {
            // Read per request so a fresh `npm run build` is picked up without restarting the server.
            const template = await fs.promises.readFile(indexFile, 'utf8');
            const pagePath = req.path.replace(/\/+$/, '') || '/';
            const isAdmin = pagePath === '/admin' || pagePath.startsWith('/admin/');
            const known = isAdmin || SITE_PATHS.includes(pagePath);
            const meta = known && !isAdmin ? await metaForPath(pagePath) : null;

            const tags = [
                `<title>${escapeHtml(meta?.meta_title || env.appName)}</title>`,
                meta?.meta_description && `<meta name="description" content="${escapeHtml(meta.meta_description)}">`,
                meta?.meta_keywords && `<meta name="keywords" content="${escapeHtml(meta.meta_keywords)}">`,
                `<meta name="robots" content="${escapeHtml(isAdmin ? 'noindex, nofollow' : meta?.robots || 'index, follow')}">`,
                meta?.canonical_url && `<link rel="canonical" href="${escapeHtml(meta.canonical_url)}">`,
            ]
                .filter(Boolean)
                .join('\n    ');

            res.status(known ? 200 : 404)
                .type('html')
                .send(template.replace(/<title data-seo>[^<]*<\/title>/, tags));
        }),
    );
}

export default router;
