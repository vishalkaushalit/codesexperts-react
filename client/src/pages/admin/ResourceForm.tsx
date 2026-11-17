import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FormField from '../../components/admin/FormField';
import PageHeader from '../../components/admin/PageHeader';
import { Button, ButtonLink, Card, LoadingBlock, type Flash } from '../../components/admin/ui';
import { adminResources, type Field } from '../../config/adminResources';
import useApi from '../../hooks/useApi';
import { api, firstErrors } from '../../services/api';
import type { Row } from '../../types/models';
import { cn } from '../../utils/helpers';

type Values = Record<string, unknown>;

/** Options for selects that come from another resource (e.g. project categories). */
function useLookups(fields: Field[]) {
    const [lookups, setLookups] = useState<Record<string, Array<[string, string]>>>({});
    useEffect(() => {
        fields
            .filter((f) => f.optionsFrom)
            .forEach((f) => {
                const src = f.optionsFrom!;
                api.get<{ data: Row[] }>(`/admin/${src.resource}/options`)
                    .then(({ data }) => setLookups((l) => ({ ...l, [f.name]: data.map((r) => [String(r[src.value]), String(r[src.label])]) })))
                    .catch(() => undefined);
            });
    }, [fields]);
    return lookups;
}

export default function ResourceForm() {
    const { resource = '', id } = useParams();
    const config = adminResources[resource];
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const fields = useMemo(() => config?.fields ?? [], [config]);
    const lookups = useLookups(fields);
    const existing = useApi<{ data: Row }>(config && isEdit ? `/admin/${resource}/${id}` : null);

    const [values, setValues] = useState<Values>(() => ({ ...(config?.defaults ?? {}) }));
    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [flash, setFlash] = useState<Flash | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (existing.data) setValues(existing.data.data);
    }, [existing.data]);

    if (!config || config.readOnly) return <Navigate to="/admin" replace />;
    if (isEdit && existing.loading) return <LoadingBlock />;
    if (isEdit && existing.error) {
        return (
            <>
                <PageHeader title={`Edit ${config.singular.toLowerCase()}`} />
                <p className="text-sm text-red-600">{existing.error.message}</p>
            </>
        );
    }

    const set = (name: string, type: Field['type']) => (value: unknown) => {
        if (type === 'image') setFiles((f) => ({ ...f, [name]: value as File | null }));
        else setValues((v) => ({ ...v, [name]: value }));
        setErrors((e) => ({ ...e, [name]: '' }));
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        setFlash(null);

        const body = new FormData();
        for (const f of fields) {
            if (f.type === 'image') {
                const file = files[f.name];
                if (file) body.append(f.name, file);
            } else if (f.type === 'checkbox') {
                body.append(f.name, values[f.name] ? '1' : '0');
            } else {
                body.append(f.name, values[f.name] == null ? '' : String(values[f.name]));
            }
        }

        try {
            if (isEdit) await api.put(`/admin/${resource}/${id}`, body);
            else await api.post(`/admin/${resource}`, body);
            const flashMessage: Flash = { type: 'success', message: `${config.singular} ${isEdit ? 'updated' : 'added'}.` };
            navigate(`/admin/${resource}`, { state: { flash: flashMessage } });
        } catch (err) {
            const fieldErrors = firstErrors(err);
            setErrors(fieldErrors);
            setFlash({ type: 'error', message: Object.keys(fieldErrors).length ? 'Please fix the highlighted fields.' : (err as Error).message });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Link to={`/admin/${resource}`} className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
                <ArrowLeft aria-hidden className="size-4" /> {config.title}
            </Link>
            <PageHeader title={`${isEdit ? 'Edit' : 'Add'} ${config.singular.toLowerCase()}`} flash={flash} />

            <Card>
                <form onSubmit={submit} noValidate>
                    <div className="grid gap-x-6 gap-y-5 p-5 sm:p-6 md:grid-cols-2">
                        {fields.map((f) => (
                            <div key={f.name} className={cn((f.full || f.type === 'richtext') && 'md:col-span-2')}>
                                <FormField
                                    field={f}
                                    value={f.type === 'image' ? values.image : values[f.name]}
                                    onChange={set(f.name, f.type)}
                                    error={errors[f.name]}
                                    options={f.options ?? lookups[f.name]}
                                    isEdit={isEdit}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:px-6">
                        <ButtonLink to={`/admin/${resource}`} variant="secondary">
                            Cancel
                        </ButtonLink>
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Saving…' : isEdit ? 'Save changes' : `Add ${config.singular.toLowerCase()}`}
                        </Button>
                    </div>
                </form>
            </Card>
        </>
    );
}
