import express, { type NextFunction, type Request, type Response } from 'express';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { env, isProduction } from './config/env.ts';
import apiRoutes from './routes/api.ts';
import webRoutes from './routes/web.ts';
import { HttpError } from './utils/http.ts';
import './types.ts';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1); // behind a reverse proxy in production (needed for rate limiting by IP)

app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

// Uploaded images (paths stored in the DB as e.g. "projectImages/x.webp").
// The sandbox CSP stops an uploaded SVG from running scripts if opened directly.
app.use(
    '/uploads',
    express.static(env.uploadsDir, {
        maxAge: '30d',
        setHeaders: (res) => {
            res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; sandbox");
            res.setHeader('X-Content-Type-Options', 'nosniff');
        },
    }),
);

app.use('/api', apiRoutes);
app.use(webRoutes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        const message = err.code === 'LIMIT_FILE_SIZE' ? 'The image must not be larger than 5 MB.' : err.message;
        res.status(422).json({ message, errors: { image: [message] } });
        return;
    }
    if ((err as { type?: string }).type === 'entity.parse.failed') {
        res.status(400).json({ message: 'Invalid JSON body.' });
        return;
    }

    const status = err instanceof HttpError ? err.status : 500;
    if (status >= 500) console.error(err);
    res.status(status).json({
        message: status >= 500 && isProduction ? 'Server error.' : (err as Error).message,
        ...(err instanceof HttpError && err.errors ? { errors: err.errors } : {}),
    });
});

app.listen(env.port, () => {
    console.log(`CodesExperts API running on http://localhost:${env.port}`);
});
