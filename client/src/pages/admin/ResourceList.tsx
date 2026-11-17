import { useState } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import Pagination from '../../components/admin/Pagination';
import PageHeader from '../../components/admin/PageHeader';
import { Badge, Button, ButtonLink, Card, LoadingBlock, type Flash } from '../../components/admin/ui';
import { adminResources, type Column } from '../../config/adminResources';
import useApi from '../../hooks/useApi';
import { api } from '../../services/api';
import type { Paginated, Row } from '../../types/models';
import { cn, formatDate, stripTags, truncate, uploadUrl } from '../../utils/helpers';

function Cell({ column, row }: { column: Column; row: Row }) {
    const value = row[column.key];
    switch (column.type) {
        case 'image':
            return value ? (
                <img src={uploadUrl(String(value))} alt="" className="size-14 rounded-md bg-slate-100 object-contain ring-1 ring-slate-200" loading="lazy" />
            ) : (
                <span className="text-slate-400">—</span>
            );
        case 'date':
            return <span className="whitespace-nowrap text-slate-500">{formatDate(value)}</span>;
        case 'boolean':
            return value ? <Badge tone="green">Active</Badge> : <Badge>Inactive</Badge>;
        case 'html':
            return <span className="text-slate-600">{truncate(stripTags(value), 90)}</span>;
        default: {
            const text = value == null ? '' : String(value);
            return column.wrap ? (
                <span className="block max-w-md min-w-56 whitespace-pre-wrap text-slate-700">{text}</span>
            ) : (
                <span className="text-slate-900">{truncate(text, 60)}</span>
            );
        }
    }
}

export default function ResourceList() {
    const { resource = '' } = useParams();
    const config = adminResources[resource];
    const [params, setParams] = useSearchParams();
    const page = Math.max(1, Number(params.get('page')) || 1);
    const { data, error, loading, reload } = useApi<Paginated<Row>>(config ? `/admin/${resource}?page=${page}` : null);
    const [flash, setFlash] = useState<Flash | null>(null);
    const [deleting, setDeleting] = useState<number | null>(null);

    if (!config) return <Navigate to="/admin" replace />;

    const remove = async (row: Row) => {
        const name = String(row.heading ?? row.name ?? row.category_name ?? row.page_name ?? row.email ?? `#${row.id}`);
        if (!window.confirm(`Delete “${stripTags(name)}”? This can’t be undone.`)) return;
        setDeleting(row.id);
        try {
            const res = await api.delete<{ message: string }>(`/admin/${resource}/${row.id}`);
            setFlash({ type: 'success', message: res.message });
            // Step back a page if we just deleted the last row on it.
            if (data && data.data.length === 1 && page > 1) setParams({ page: String(page - 1) });
            else reload();
        } catch (err) {
            setFlash({ type: 'error', message: (err as Error).message });
        } finally {
            setDeleting(null);
        }
    };

    const rows = data?.data ?? [];
    const Icon = config.icon;

    return (
        <>
            <PageHeader
                key={resource}
                title={config.title}
                flash={flash}
                actions={
                    !config.readOnly && (
                        <ButtonLink to={`/admin/${resource}/new`}>
                            <Plus aria-hidden className="size-4" /> Add {config.singular.toLowerCase()}
                        </ButtonLink>
                    )
                }
            />

            <Card className="overflow-hidden">
                {loading && !data ? (
                    <LoadingBlock />
                ) : error ? (
                    <p className="p-6 text-sm text-red-600">{error.message}</p>
                ) : rows.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                        <Icon aria-hidden className="size-8 text-slate-300" />
                        <p className="text-sm text-slate-500">
                            {config.readOnly ? `No ${config.title.toLowerCase()} yet.` : `No ${config.title.toLowerCase()} yet. Add the first one.`}
                        </p>
                        {!config.readOnly && (
                            <ButtonLink to={`/admin/${resource}/new`} variant="secondary">
                                <Plus aria-hidden className="size-4" /> Add {config.singular.toLowerCase()}
                            </ButtonLink>
                        )}
                    </div>
                ) : (
                    <div className={cn('overflow-x-auto', loading && 'opacity-60')}>
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium tracking-wide text-slate-500 uppercase">
                                <tr>
                                    <th scope="col" className="w-12 px-4 py-3">
                                        #
                                    </th>
                                    {config.columns.map((c) => (
                                        <th key={c.key} scope="col" className="px-4 py-3">
                                            {c.label}
                                        </th>
                                    ))}
                                    <th scope="col" className="px-4 py-3 text-right">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rows.map((row, i) => (
                                    <tr key={row.id} className="align-middle hover:bg-slate-50/60">
                                        <td className="px-4 py-3 text-slate-400 tabular-nums">{(page - 1) * (data?.perPage ?? 10) + i + 1}</td>
                                        {config.columns.map((c) => (
                                            <td key={c.key} className="px-4 py-3">
                                                <Cell column={c} row={row} />
                                            </td>
                                        ))}
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                {!config.readOnly && (
                                                    <ButtonLink to={`/admin/${resource}/${row.id}/edit`} variant="secondary" size="sm">
                                                        <Pencil aria-hidden className="size-3.5" /> Edit
                                                    </ButtonLink>
                                                )}
                                                <Button variant="danger" size="sm" disabled={deleting === row.id} onClick={() => remove(row)}>
                                                    <Trash2 aria-hidden className="size-3.5" /> {deleting === row.id ? 'Deleting…' : 'Delete'}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {data && data.total > 0 && (
                    <Pagination page={data.page} lastPage={data.lastPage} total={data.total} perPage={data.perPage} onChange={(p) => setParams({ page: String(p) })} />
                )}
            </Card>
        </>
    );
}
