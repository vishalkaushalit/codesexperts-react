import { Router, type RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import * as pub from '../controllers/publicController.ts';
import * as auth from '../controllers/authController.ts';
import * as admin from '../controllers/adminController.ts';
import * as resource from '../controllers/resourceController.ts';
import { requireAuth } from '../middleware/auth.ts';
import { handle } from '../utils/http.ts';
import { upload } from '../utils/uploads.ts';

const limiter = (limit: number): RequestHandler =>
    rateLimit({
        windowMs: 60_000,
        limit,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        message: { message: 'Too many requests. Please try again in a minute.' },
    });

const router = Router();

// ---- Public website ----
router.get('/site', handle(pub.site));
router.get('/home', handle(pub.home));
router.get('/about', handle(pub.about));
router.get('/services', handle(pub.services));
router.get('/services/web-development', handle(pub.webDevelopment));
router.get('/projects', handle(pub.projects));
router.get('/blog', handle(pub.blog));
router.get('/privacy-policy', handle(pub.privacyPolicy));
router.get('/meta', handle(pub.meta));
router.post('/contact', limiter(10), handle(pub.contact));
router.post('/subscribe', limiter(10), handle(pub.subscribe));

// ---- Auth ----
router.post('/auth/login', limiter(5), handle(auth.login));
router.post('/auth/logout', handle(auth.logout));
router.get('/auth/me', requireAuth, handle(auth.me));
router.put('/auth/profile', requireAuth, handle(auth.updateProfile));
router.put('/auth/password', requireAuth, limiter(10), handle(auth.updatePassword));

// ---- Admin (all require login) ----
const a = Router();
a.use(requireAuth);
a.get('/dashboard', handle(admin.dashboard));
a.get('/settings', handle(admin.getSettings));
a.put('/settings', handle(admin.updateSettings));
a.get('/:resource', handle(resource.list));
a.get('/:resource/options', handle(resource.options));
a.get('/:resource/:id', handle(resource.show));
a.post('/:resource', upload.single('image'), handle(resource.create));
a.put('/:resource/:id', upload.single('image'), handle(resource.update));
a.delete('/:resource/:id', handle(resource.remove));
router.use('/admin', a);

router.use((_req, res) => {
    res.status(404).json({ message: 'Not found.' });
});

export default router;
