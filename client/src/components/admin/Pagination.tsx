import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface Props {
    page: number;
    lastPage: number;
    total: number;
    perPage: number;
    onChange: (page: number) => void;
}

export default function Pagination({ page, lastPage, total, perPage, onChange }: Props) {
    const from = total === 0 ? 0 : (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);

    // First, last, and two pages either side of the current one.
    const pages = [...new Set([1, page - 2, page - 1, page, page + 1, page + 2, lastPage])].filter((p) => p >= 1 && p <= lastPage).sort((a, b) => a - b);

    const btn = 'inline-flex min-w-9 items-center justify-center rounded-lg px-2.5 py-1.5 text-sm';

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
            <p className="text-sm text-slate-500">
                {total === 0 ? 'No results' : `Showing ${from}–${to} of ${total}`}
            </p>
            {lastPage > 1 && (
                <nav aria-label="Pagination" className="flex items-center gap-1">
                    <button type="button" className={cn(btn, 'text-slate-600 hover:bg-slate-100 disabled:opacity-40')} disabled={page === 1} onClick={() => onChange(page - 1)}>
                        <ChevronLeft className="size-4" /> <span className="sr-only">Previous</span>
                    </button>
                    {pages.map((p, i) => (
                        <span key={p} className="flex items-center gap-1">
                            {i > 0 && p - pages[i - 1] > 1 && <span className="px-1 text-slate-400">…</span>}
                            <button
                                type="button"
                                aria-current={p === page ? 'page' : undefined}
                                className={cn(btn, p === page ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100')}
                                onClick={() => onChange(p)}
                            >
                                {p}
                            </button>
                        </span>
                    ))}
                    <button type="button" className={cn(btn, 'text-slate-600 hover:bg-slate-100 disabled:opacity-40')} disabled={page === lastPage} onClick={() => onChange(page + 1)}>
                        <ChevronRight className="size-4" /> <span className="sr-only">Next</span>
                    </button>
                </nav>
            )}
        </div>
    );
}
