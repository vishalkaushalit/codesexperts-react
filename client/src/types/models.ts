/** Shapes of the rows returned by the API (same columns as the MySQL tables). */

export interface Timestamps {
    created_at: string | null;
    updated_at?: string | null;
}

export interface Testimonial extends Timestamps {
    id: number;
    image: string | null;
    description: string | null;
    name: string;
    profile: string | null;
}

export interface Logo extends Timestamps {
    id: number;
    image: string | null;
    heading: string;
    direction: 'left' | 'right';
}

export interface Service extends Timestamps {
    id: number;
    image: string | null;
    heading: string;
    slug: string | null;
    description: string | null;
}

export interface WebService extends Timestamps {
    id: number;
    image: string | null;
    heading: string;
    description: string | null;
}

export interface WebTechnology extends Timestamps {
    id: number;
    image: string | null;
    heading: string;
}

export interface Project extends Timestamps {
    id: number;
    image: string | null;
    heading: string;
    category: number | string | null;
    category_name: string | null;
    category_id?: number;
}

export interface BlogPost extends Timestamps {
    id: number;
    image: string | null;
    title: string | null;
    slug: string | null;
    description: string | null;
}

export interface Policy extends Timestamps {
    id: number;
    name: string;
    description: string | null;
}

export interface Setting extends Timestamps {
    id: number;
    email: string | null;
    phone: string | null;
    address: string | null;
    facebook: string | null;
    instagram: string | null;
}

export interface MetaTags {
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    robots: string | null;
    canonical_url: string | null;
}

export interface Enquiry {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    created_at: string | null;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

/** Any admin table row (columns vary by resource). */
export type Row = { id: number } & Record<string, unknown>;

export interface Paginated<T> {
    data: T[];
    page: number;
    perPage: number;
    total: number;
    lastPage: number;
}

/* ---- Public API responses ---- */
export interface HomeData {
    testimonials: Testimonial[];
    leftMarquee: Logo[];
    rightMarquee: Logo[];
}
export interface AboutData {
    testimonials: Testimonial[];
    services: Service[];
}
export interface ServicesData {
    services: Service[];
}
export interface WebDevelopmentData {
    webServices: WebService[];
    webTechnologies: WebTechnology[];
}
export interface ProjectsData {
    projects: Project[];
}
export interface BlogData {
    blog: BlogPost[];
}
export interface PolicyData {
    policy: Policy | null;
}
export interface SiteData {
    social: { facebook: string; instagram: string };
}
export interface DashboardData {
    counts: { services: number; projects: number; testimonials: number; enquiries: number; subscribers: number };
    latestEnquiries: Enquiry[];
}
