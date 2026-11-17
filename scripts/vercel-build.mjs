/**
 * Builds the site for Vercel using the Build Output API (https://vercel.com/docs/build-output-api/v3):
 *   .vercel/output/static/          built React app (served by Vercel's CDN), minus index.html
 *   .vercel/output/functions/api.func  the whole Express app bundled into one Node function
 * Requests that don't match a static file (/api/*, /sitemap.xml, every page URL) go to the function,
 * which injects per-page SEO tags into index.html.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

const root = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const out = path.join(root, '.vercel/output');
const dist = path.join(root, 'client/dist');
const fn = path.join(out, 'functions/api.func');

execSync('npm --prefix client run build', { cwd: root, stdio: 'inherit' });

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(dist, path.join(out, 'static'), { recursive: true, filter: (src) => src !== path.join(dist, 'index.html') });

await build({
    entryPoints: [path.join(root, 'server/src/app.ts')],
    outfile: path.join(fn, 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: 'node22',
    format: 'esm',
    // Let bundled CommonJS packages (express, mongodb, …) use require() inside an ES module.
    banner: { js: "import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);" },
    // Optional MongoDB driver add-ons the app never uses.
    external: ['kerberos', '@mongodb-js/zstd', '@aws-sdk/credential-providers', 'gcp-metadata', 'snappy', 'socks', 'aws4', 'mongodb-client-encryption'],
    logLevel: 'warning',
});
fs.copyFileSync(path.join(dist, 'index.html'), path.join(fn, 'index.html'));
fs.writeFileSync(
    path.join(fn, '.vc-config.json'),
    JSON.stringify({ runtime: 'nodejs22.x', handler: 'index.mjs', launcherType: 'Nodejs', shouldAddHelpers: false }, null, 2),
);

fs.writeFileSync(
    path.join(out, 'config.json'),
    JSON.stringify(
        {
            version: 3,
            routes: [
                // Vite's hashed files never change.
                { src: '^/assets/(.*)$', headers: { 'cache-control': 'public, max-age=31536000, immutable' }, continue: true },
                { handle: 'filesystem' },
                { src: '^/(.*)$', dest: '/api' },
            ],
        },
        null,
        2,
    ),
);

console.log('Vercel build output written to .vercel/output');
