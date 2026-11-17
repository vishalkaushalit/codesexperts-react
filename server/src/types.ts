/** Document shapes of the MongoDB collections used by the API. */

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

export interface Setting {
    id: number;
    email: string | null;
    phone: string | null;
    address: string | null;
    facebook: string | null;
    instagram: string | null;
}

export interface MetaTag {
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    robots: string | null;
    canonical_url: string | null;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            /** Set by requireAuth for admin routes. */
            user?: User;
        }
    }
}
