import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import type { MetaTags } from '../types/models';

const APP_NAME = 'CodesExperts';

function setHeadTag(selector: string, create: () => HTMLElement, attr: string, value: string | null | undefined) {
    let el = document.head.querySelector(selector);
    if (!value) {
        el?.remove();
        return;
    }
    if (!el) {
        el = create();
        document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
}

const metaTag = (name: string) => () => Object.assign(document.createElement('meta'), { name });

/** Set the page title / meta robots directly (used by the admin panel). */
export function setPageMeta(title: string, robots: string) {
    document.title = title;
    setHeadTag('meta[name="robots"]', metaTag('robots'), 'content', robots);
}

/**
 * Keeps <title> and meta tags in sync with the admin-managed meta_tags table.
 * The first page load is already rendered by the server, so only client-side navigations fetch.
 */
export default function useSeoMeta() {
    const { pathname } = useLocation();
    const firstLoad = useRef(true);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            // Dev server and admin->website navigation have no server-rendered title.
            if (document.title !== APP_NAME) return;
        }
        let cancelled = false;
        api.get<{ meta: MetaTags | null }>(`/meta?path=${encodeURIComponent(pathname)}`)
            .then(({ meta }) => {
                if (cancelled) return;
                document.title = meta?.meta_title || APP_NAME;
                setHeadTag('meta[name="description"]', metaTag('description'), 'content', meta?.meta_description);
                setHeadTag('meta[name="keywords"]', metaTag('keywords'), 'content', meta?.meta_keywords);
                setHeadTag('meta[name="robots"]', metaTag('robots'), 'content', meta?.robots || 'index, follow');
                setHeadTag('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', meta?.canonical_url);
            })
            .catch(() => {
                if (!cancelled) document.title = APP_NAME;
            });
        return () => {
            cancelled = true;
        };
    }, [pathname]);
}
