import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminChrome } from '../../layouts/AdminLayout';
import { firstErrors } from '../../services/api';
import { publicAsset } from '../../utils/helpers';
import { Button, Card, LoadingBlock, inputClass } from '../../components/admin/ui';

export default function Login() {
    useAdminChrome();
    const { user, checking, login } = useAuth();
    const navigate = useNavigate();
    const from = (useLocation().state as { from?: string } | null)?.from ?? '/admin';

    const [form, setForm] = useState({ email: '', password: '', remember: false });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [message, setMessage] = useState('');
    const [busy, setBusy] = useState(false);

    if (checking) return <LoadingBlock />;
    if (user) return <Navigate to={from} replace />;

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setBusy(true);
        setErrors({});
        setMessage('');
        try {
            await login(form);
            navigate(from, { replace: true });
        } catch (err) {
            const fieldErrors = firstErrors(err);
            setErrors(fieldErrors);
            if (!Object.keys(fieldErrors).length) setMessage((err as Error).message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-10 font-sans">
            <Link to="/" className="mb-8 rounded-lg bg-black px-4 py-2">
                <img src={publicAsset('assets/images/logo_horizontal.webp')} alt="CodesExperts website" className="h-10" />
            </Link>
            <Card className="w-full max-w-sm p-6 sm:p-8">
                <h1 className="text-xl font-semibold text-slate-900">Sign in to the admin panel</h1>
                <p className="mt-1 text-sm text-slate-500">Manage the website content, enquiries and SEO.</p>

                <form onSubmit={submit} noValidate className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="username"
                            autoFocus
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                            className={inputClass(Boolean(errors.email))}
                        />
                        {errors.email && (
                            <p id="email-error" className="mt-1.5 text-sm text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            aria-invalid={Boolean(errors.password)}
                            aria-describedby={errors.password ? 'password-error' : undefined}
                            className={inputClass(Boolean(errors.password))}
                        />
                        {errors.password && (
                            <p id="password-error" className="mt-1.5 text-sm text-red-600">
                                {errors.password}
                            </p>
                        )}
                    </div>
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                            type="checkbox"
                            checked={form.remember}
                            onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                            className="size-4 rounded border-slate-300 accent-brand"
                        />
                        Keep me signed in for 30 days
                    </label>
                    {message && (
                        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                            {message}
                        </p>
                    )}
                    <Button type="submit" disabled={busy} className="w-full">
                        {busy ? 'Signing in…' : 'Sign in'}
                    </Button>
                </form>
            </Card>
            <Link to="/" className="mt-6 text-sm text-slate-500 hover:text-slate-800">
                ← Back to website
            </Link>
        </div>
    );
}
