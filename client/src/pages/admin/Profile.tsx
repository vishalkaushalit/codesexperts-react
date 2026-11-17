import { useState, type FormEvent, type ReactNode } from 'react';
import PageHeader from '../../components/admin/PageHeader';
import { Alert, Button, Card, inputClass, type Flash } from '../../components/admin/ui';
import { useAuth } from '../../context/AuthContext';
import { api, firstErrors } from '../../services/api';
import type { User } from '../../types/models';

function Input({
    id,
    label,
    type = 'text',
    value,
    onChange,
    error,
    autoComplete,
}: {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    autoComplete?: string;
}) {
    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                autoComplete={autoComplete}
                onChange={(e) => onChange(e.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                className={inputClass(Boolean(error))}
            />
            {error && (
                <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
    return (
        <Card className="grid gap-6 p-5 sm:p-6 md:grid-cols-3">
            <div>
                <h2 className="font-semibold text-slate-900">{title}</h2>
                <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>
            <div className="md:col-span-2">{children}</div>
        </Card>
    );
}

export default function Profile() {
    const { user, setUser } = useAuth();

    const [info, setInfo] = useState({ name: user?.name ?? '', email: user?.email ?? '' });
    const [infoErrors, setInfoErrors] = useState<Record<string, string>>({});
    const [infoFlash, setInfoFlash] = useState<Flash | null>(null);

    const [pw, setPw] = useState({ current_password: '', password: '', password_confirmation: '' });
    const [pwErrors, setPwErrors] = useState<Record<string, string>>({});
    const [pwFlash, setPwFlash] = useState<Flash | null>(null);
    const [busy, setBusy] = useState<'info' | 'pw' | null>(null);

    const saveInfo = async (e: FormEvent) => {
        e.preventDefault();
        setBusy('info');
        setInfoErrors({});
        setInfoFlash(null);
        try {
            const res = await api.put<{ message: string; user: User }>('/auth/profile', info);
            setUser(res.user);
            setInfoFlash({ type: 'success', message: 'Profile saved.' });
        } catch (err) {
            setInfoErrors(firstErrors(err));
            if (!Object.keys(firstErrors(err)).length) setInfoFlash({ type: 'error', message: (err as Error).message });
        } finally {
            setBusy(null);
        }
    };

    const savePassword = async (e: FormEvent) => {
        e.preventDefault();
        setBusy('pw');
        setPwErrors({});
        setPwFlash(null);
        try {
            await api.put('/auth/password', pw);
            setPw({ current_password: '', password: '', password_confirmation: '' });
            setPwFlash({ type: 'success', message: 'Password updated. Other signed-in devices have been signed out.' });
        } catch (err) {
            setPwErrors(firstErrors(err));
            if (!Object.keys(firstErrors(err)).length) setPwFlash({ type: 'error', message: (err as Error).message });
        } finally {
            setBusy(null);
        }
    };

    return (
        <>
            <PageHeader title="My profile" />
            <div className="space-y-6">
                <Section title="Profile information" description="Your name and the email you sign in with.">
                    <form onSubmit={saveInfo} noValidate className="space-y-4">
                        {infoFlash && <Alert flash={infoFlash} onClose={() => setInfoFlash(null)} />}
                        <Input id="name" label="Name" value={info.name} onChange={(v) => setInfo({ ...info, name: v })} error={infoErrors.name} autoComplete="name" />
                        <Input id="email" label="Email" type="email" value={info.email} onChange={(v) => setInfo({ ...info, email: v })} error={infoErrors.email} autoComplete="email" />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={busy === 'info'}>
                                {busy === 'info' ? 'Saving…' : 'Save profile'}
                            </Button>
                        </div>
                    </form>
                </Section>

                <Section title="Change password" description="Use at least 8 characters. Changing it signs out your other sessions.">
                    <form onSubmit={savePassword} noValidate className="space-y-4">
                        {pwFlash && <Alert flash={pwFlash} onClose={() => setPwFlash(null)} />}
                        <Input
                            id="current_password"
                            label="Current password"
                            type="password"
                            autoComplete="current-password"
                            value={pw.current_password}
                            onChange={(v) => setPw({ ...pw, current_password: v })}
                            error={pwErrors.current_password}
                        />
                        <Input
                            id="password"
                            label="New password"
                            type="password"
                            autoComplete="new-password"
                            value={pw.password}
                            onChange={(v) => setPw({ ...pw, password: v })}
                            error={pwErrors.password}
                        />
                        <Input
                            id="password_confirmation"
                            label="Confirm new password"
                            type="password"
                            autoComplete="new-password"
                            value={pw.password_confirmation}
                            onChange={(v) => setPw({ ...pw, password_confirmation: v })}
                            error={pwErrors.password_confirmation}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={busy === 'pw'}>
                                {busy === 'pw' ? 'Updating…' : 'Update password'}
                            </Button>
                        </div>
                    </form>
                </Section>
            </div>
        </>
    );
}
