import type { LucideIcon } from 'lucide-react';
import { Briefcase, Cpu, FileText, FolderTree, Globe, Images, Inbox, Mail, MessageSquareQuote, Tags, LayoutTemplate } from 'lucide-react';

/**
 * Admin CRUD screens. Each key matches a resource in server/src/resources/definitions.ts.
 * The generic ResourceList / ResourceForm pages render from this config.
 */

export type ColumnType = 'text' | 'html' | 'image' | 'date' | 'boolean';
export type FieldType = 'text' | 'textarea' | 'richtext' | 'image' | 'select' | 'url' | 'checkbox';

export interface Column {
    key: string;
    label: string;
    type?: ColumnType;
    /** Show the full text instead of truncating it. */
    wrap?: boolean;
}

export interface Field {
    name: string;
    label: string;
    type?: FieldType;
    required?: boolean;
    placeholder?: string;
    hint?: string;
    /** Show a live character counter with this limit. */
    max?: number;
    rows?: number;
    /** Accepted file types for image fields. */
    accept?: string;
    /** Static <select> options as [value, label]. */
    options?: Array<[string, string]>;
    /** Load <select> options from another resource. */
    optionsFrom?: { resource: string; value: string; label: string };
    /** Autocomplete suggestions for text inputs. */
    suggestions?: string[];
    /** Take the full form width on large screens. */
    full?: boolean;
}

export interface ResourceConfig {
    title: string;
    singular: string;
    icon: LucideIcon;
    columns: Column[];
    fields?: Field[];
    defaults?: Record<string, unknown>;
    readOnly?: boolean;
}

const created: Column = { key: 'created_at', label: 'Created', type: 'date' };

export const META_PAGES: Array<[string, string]> = [
    ['Home', '/'],
    ['About Us', '/about-us'],
    ['Services', '/services'],
    ['Web Development', '/services/web-development'],
    ['Digital Marketing', '/services/digital-marketing'],
    ['UI/UX Design', '/services/ui-ux-design'],
    ['Ecommerce Solutions', '/services/ecommerce-solutions'],
    ['Video Editing & Motion Graphics', '/services/video-editing-and-motion-graphics'],
    ['Projects', '/projects'],
    ['Contact', '/contact'],
    ['Blog', '/blog'],
    ['Privacy Policy', '/privacy-policy'],
    ['Terms and Conditions', '/terms-and-conditions'],
];

const IMAGE_HINT = 'JPG, PNG or WebP, up to 5 MB.';

export const adminResources: Record<string, ResourceConfig> = {
    'logo-slider': {
        title: 'Logo Slider',
        singular: 'Logo',
        icon: LayoutTemplate,
        columns: [{ key: 'image', label: 'Logo', type: 'image' }, { key: 'heading', label: 'Heading' }, { key: 'direction', label: 'Direction' }, created],
        fields: [
            { name: 'image', label: 'Logo', type: 'image', required: true, hint: IMAGE_HINT, full: true },
            { name: 'heading', label: 'Heading', required: true, hint: 'Client name, shown as the logo tooltip.' },
            { name: 'direction', label: 'Scroll direction', type: 'select', required: true, options: [['left', 'Left (top row)'], ['right', 'Right (bottom row)']] },
        ],
    },
    projects: {
        title: 'Projects',
        singular: 'Project',
        icon: Images,
        columns: [{ key: 'image', label: 'Image', type: 'image' }, { key: 'heading', label: 'Heading' }, { key: 'category_name', label: 'Category' }, created],
        fields: [
            { name: 'image', label: 'Screenshot', type: 'image', required: true, hint: `${IMAGE_HINT} Use a full-page screenshot; it scrolls on hover.`, full: true },
            { name: 'heading', label: 'Project name', required: true },
            { name: 'category', label: 'Category', type: 'select', required: true, optionsFrom: { resource: 'project-categories', value: 'id', label: 'category_name' } },
        ],
    },
    'project-categories': {
        title: 'Project Categories',
        singular: 'Category',
        icon: FolderTree,
        columns: [{ key: 'category_name', label: 'Category' }, created],
        fields: [{ name: 'category_name', label: 'Category name', required: true }],
    },
    services: {
        title: 'Services',
        singular: 'Service',
        icon: Briefcase,
        columns: [{ key: 'image', label: 'Image', type: 'image' }, { key: 'heading', label: 'Heading' }, { key: 'slug', label: 'Slug' }, { key: 'description', label: 'Description', type: 'html' }],
        fields: [
            { name: 'image', label: 'Image', type: 'image', required: true, hint: `${IMAGE_HINT} Recommended 360×240px.`, full: true },
            { name: 'heading', label: 'Heading', required: true },
            { name: 'slug', label: 'Slug', required: true, placeholder: 'web-development', hint: 'Page address: /services/<slug>. Lowercase letters, numbers and dashes.' },
            { name: 'description', label: 'Description', type: 'richtext', required: true, full: true },
        ],
    },
    'web-services': {
        title: 'Website Services',
        singular: 'Website Service',
        icon: Globe,
        columns: [{ key: 'image', label: 'Image', type: 'image' }, { key: 'heading', label: 'Heading', type: 'html' }, { key: 'description', label: 'Description', type: 'html' }],
        fields: [
            { name: 'image', label: 'Icon / image', type: 'image', required: true, hint: IMAGE_HINT, full: true },
            { name: 'heading', label: 'Heading', required: true, full: true },
            { name: 'description', label: 'Description', type: 'richtext', required: true, full: true },
        ],
    },
    'web-technologies': {
        title: 'Website Technology',
        singular: 'Technology',
        icon: Cpu,
        columns: [{ key: 'image', label: 'Icon', type: 'image' }, { key: 'heading', label: 'Name' }, created],
        fields: [
            { name: 'image', label: 'Icon', type: 'image', required: true, accept: 'image/jpeg,image/png,image/webp,image/svg+xml', hint: 'JPG, PNG, WebP or SVG, up to 5 MB.', full: true },
            { name: 'heading', label: 'Name', required: true },
        ],
    },
    testimonials: {
        title: 'Testimonials',
        singular: 'Testimonial',
        icon: MessageSquareQuote,
        columns: [{ key: 'image', label: 'Photo', type: 'image' }, { key: 'name', label: 'Name' }, { key: 'profile', label: 'Profile' }, { key: 'description', label: 'Quote', type: 'html' }, created],
        fields: [
            { name: 'image', label: 'Photo or logo', type: 'image', required: true, hint: IMAGE_HINT, full: true },
            { name: 'name', label: 'Name', required: true },
            { name: 'profile', label: 'Profile', required: true, placeholder: 'e.g. Founder, Acme Ltd' },
            { name: 'description', label: 'Quote', type: 'textarea', required: true, max: 1000, full: true },
        ],
    },
    enquiries: {
        title: 'Enquiries',
        singular: 'Enquiry',
        icon: Inbox,
        readOnly: true,
        columns: [
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'subject', label: 'Subject' },
            { key: 'message', label: 'Message', wrap: true },
            { key: 'created_at', label: 'Received', type: 'date' },
        ],
    },
    subscribers: {
        title: 'Subscribers',
        singular: 'Subscriber',
        icon: Mail,
        readOnly: true,
        columns: [{ key: 'email', label: 'Email' }, { key: 'created_at', label: 'Subscribed', type: 'date' }],
    },
    'meta-tags': {
        title: 'Meta Tags',
        singular: 'Meta Tags',
        icon: Tags,
        columns: [
            { key: 'page_name', label: 'Page' },
            { key: 'page_path', label: 'Path' },
            { key: 'meta_title', label: 'Meta title' },
            { key: 'robots', label: 'Robots' },
            { key: 'is_active', label: 'Status', type: 'boolean' },
        ],
        defaults: { robots: 'index, follow', is_active: true },
        fields: [
            { name: 'page_name', label: 'Page name', required: true, suggestions: META_PAGES.map(([n]) => n) },
            { name: 'page_path', label: 'Page path', required: true, placeholder: '/about-us', suggestions: META_PAGES.map(([, p]) => p) },
            { name: 'meta_title', label: 'Meta title', max: 60, full: true },
            { name: 'meta_description', label: 'Meta description', type: 'textarea', max: 160, rows: 3, full: true },
            { name: 'meta_keywords', label: 'Meta keywords', type: 'textarea', rows: 2, full: true, hint: 'Comma-separated.' },
            { name: 'canonical_url', label: 'Canonical URL', type: 'url', placeholder: 'https://codesexperts.com/…' },
            { name: 'robots', label: 'Robots', type: 'select', required: true, options: ['index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow'].map((r) => [r, r]) },
            { name: 'is_active', label: 'Active (use these tags on the page)', type: 'checkbox', full: true },
        ],
    },
    policies: {
        title: 'Policies',
        singular: 'Policy',
        icon: FileText,
        columns: [{ key: 'name', label: 'Name' }, { key: 'description', label: 'Content', type: 'html' }, created],
        fields: [
            { name: 'name', label: 'Name', required: true, full: true },
            { name: 'description', label: 'Content', type: 'richtext', required: true, full: true, hint: 'Policy #1 is shown on the Privacy Policy page.' },
        ],
    },
};

/** Sidebar groups (same order as the old Laravel admin). */
export const SIDEBAR: Array<{ heading: string; items: string[] }> = [
    { heading: 'Website content', items: ['logo-slider', 'projects', 'project-categories', 'services', 'web-services', 'web-technologies', 'testimonials', 'policies'] },
    { heading: 'Leads', items: ['enquiries', 'subscribers'] },
    { heading: 'SEO', items: ['meta-tags'] },
];
