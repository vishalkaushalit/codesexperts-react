import { useEffect, useState, type FormEvent } from 'react';
import FormField from '../../components/admin/FormField';
import PageHeader from '../../components/admin/PageHeader';
import { Button, Card, LoadingBlock, type Flash } from '../../components/admin/ui';
import type { Field } from '../../config/adminResources';
import useApi from '../../hooks/useApi';
import { api, firstErrors } from '../../services/api';
import type { Setting } from '../../types/models';

const FIELDS: Field[] = [
    { name: 'email', label: 'Email', required: true },
    { name: 'phone', label: 'Phone', required: true, hint: '10 digits, no spaces or country code.' },
    { name: 'address', label: 'Address', type: 'textarea', required: true, rows: 3, full: true },
    { name: 'facebook', label: 'Facebook URL', type: 'url', placeholder: 'https://facebook.com/…', hint: 'Shown in the website footer.' },
    { name: 'instagram', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/…', hint: 'Shown in the website footer.' },
];

export default function Settings() {
    const { data, error, loading } = useApi<{ data: Setting }>('/admin/settings');
    const [values, setValues] = useState<Record<string, unknown>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [flash, setFlash] = useState<Flash | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (data) {
            // Older rows stored "N/A" for an empty link.
            const s = { ...data.data } as Record<string, unknown>;
            ['facebook', 'instagram'].forEach((k) => s[k] === 'N/A' && (s[k] = ''));
            setValues(s);
        }
    }, [data]);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            const body = Object.fromEntries(FIELDS.map((f) => [f.name, values[f.name] ?? '']));
            const res = await api.put<{ message: string }>('/admin/settings', body);
            setFlash({ type: 'success', message: res.message });
        } catch (err) {
            const fieldErrors = firstErrors(err);
            setErrors(fieldErrors);
            setFlash({ type: 'error', message: Object.keys(fieldErrors).length ? 'Please fix the highlighted fields.' : (err as Error).message });
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <PageHeader title="Settings" description="Company contact details and social links." flash={flash} />
            {loading ? (
                <LoadingBlock />
            ) : error ? (
                <p className="text-sm text-red-600">{error.message}</p>
            ) : (
                <Card>
                    <form onSubmit={submit} noValidate>
                        <div className="grid gap-x-6 gap-y-5 p-5 sm:p-6 md:grid-cols-2">
                            {FIELDS.map((f) => (
                                <div key={f.name} className={f.full ? 'md:col-span-2' : undefined}>
                                    <FormField field={f} value={values[f.name]} onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))} error={errors[f.name]} />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:px-6">
                            <Button type="submit" disabled={saving}>
                                {saving ? 'Saving…' : 'Save settings'}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}
        </>
    );
}
