import type { Document, Sort } from 'mongodb';
import type { Rule, Rules } from '../utils/validate.ts';

/**
 * Admin-managed collections (named after the old MySQL tables). The generic resource controller uses these to list / create / update / delete.
 * Keep the keys in sync with client/src/config/adminResources.ts.
 */
export interface ResourceDefinition {
    table: string;
    sort: Sort;
    /** Extra aggregation stages for the list view (e.g. a $lookup), run after paging. */
    listStages?: Document[];
    /** Stored under uploads/<dir>/ and saved in the `image` column. */
    image?: { dir: string; required: boolean; allowSvg?: boolean };
    fields?: Rules;
    /** Fields that must be unique in the collection. */
    unique?: string[];
    /** Refuse deletion while documents in another collection reference this one. */
    guardDelete?: { table: string; column: string; message: string };
    /** Normalise the request body before validation. */
    prepare?: (body: Record<string, unknown>) => Record<string, unknown>;
    /** List + delete only (e.g. form submissions). */
    readOnly?: boolean;
}

const text = (label: string, max = 255, required = true): Rule => ({ label, required, max });

export const resources: Record<string, ResourceDefinition> = {
    'logo-slider': {
        table: 'logoSlider',
        sort: { id: -1 },
        image: { dir: 'logoSliderImages', required: true },
        fields: {
            heading: text('heading'),
            direction: { label: 'direction', required: true, in: ['left', 'right'] },
        },
    },

    projects: {
        table: 'projects',
        sort: { id: -1 },
        // Left join: show the category name, but keep projects whose category is missing.
        listStages: [
            { $lookup: { from: 'project_category', localField: 'category', foreignField: 'id', as: 'cat' } },
            { $set: { category_name: { $first: '$cat.category_name' } } },
            { $project: { cat: 0 } },
        ],
        image: { dir: 'projectImages', required: true },
        fields: {
            heading: text('heading'),
            category: { label: 'category', required: true, type: 'integer', exists: 'project_category' },
        },
    },

    'project-categories': {
        table: 'project_category',
        sort: { id: 1 },
        fields: { category_name: text('category name') },
        // The website only shows projects whose category exists, so deleting a used category would hide them.
        guardDelete: { table: 'projects', column: 'category', message: 'This category is used by %d project(s). Move or delete them first.' },
    },

    services: {
        table: 'services',
        sort: { id: -1 },
        image: { dir: 'servicesImages', required: true },
        fields: {
            heading: text('heading'),
            slug: {
                label: 'slug',
                required: true,
                max: 255,
                pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                patternMessage: 'The slug may only contain lowercase letters, numbers and dashes.',
            },
            description: { label: 'description', required: true },
        },
    },

    'web-services': {
        table: 'webServices',
        sort: { id: -1 },
        image: { dir: 'webServicesImages', required: true },
        fields: {
            heading: text('heading'),
            description: { label: 'description', required: true },
        },
    },

    'web-technologies': {
        table: 'webTechnology',
        sort: { id: -1 },
        image: { dir: 'webTechnologyImages', required: true, allowSvg: true },
        fields: { heading: text('heading') },
    },

    testimonials: {
        table: 'testimonial',
        sort: { id: -1 },
        image: { dir: 'testimonialImages', required: true },
        fields: {
            name: text('name'),
            profile: text('profile'),
            description: { label: 'description', required: true, max: 1000 },
        },
    },

    policies: {
        table: 'policy',
        sort: { id: -1 },
        fields: {
            name: text('name'),
            description: { label: 'description', required: true },
        },
    },

    'meta-tags': {
        table: 'meta_tags',
        sort: { id: -1 },
        unique: ['page_path'],
        fields: {
            page_name: text('page name'),
            page_path: text('page path'),
            meta_title: text('meta title', 60, false),
            meta_description: text('meta description', 160, false),
            meta_keywords: { label: 'meta keywords', required: false, max: 5000 },
            canonical_url: { label: 'canonical url', required: false, type: 'url', max: 255 },
            robots: { label: 'robots', required: true, in: ['index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow'] },
            is_active: { type: 'boolean' },
        },
        prepare(body) {
            const p = String(body.page_path ?? '').trim();
            return { ...body, page_path: p === '' ? '' : p === '/' ? '/' : '/' + p.replace(/^\/+/, '') };
        },
    },

    enquiries: { table: 'contact', sort: { id: -1 }, readOnly: true },
    subscribers: { table: 'subscribe', sort: { id: -1 }, readOnly: true },
};
