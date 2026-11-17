import { useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, type Flash } from './ui';

/**
 * Page title + actions, and a flash message passed via navigate(path, { state: { flash } }).
 */
export default function PageHeader({ title, description, actions, flash: flashProp }: { title: string; description?: string; actions?: ReactNode; flash?: Flash | null }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [flash, setFlash] = useState<Flash | null>((location.state as { flash?: Flash } | null)?.flash ?? null);

    // Clear router state so the message doesn't reappear on refresh.
    useEffect(() => {
        if ((location.state as { flash?: Flash } | null)?.flash) navigate(location.pathname + location.search, { replace: true, state: null });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (flashProp !== undefined) setFlash(flashProp);
    }, [flashProp]);

    return (
        <div className="mb-6 space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
                    {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
                </div>
                {actions && <div className="flex gap-2">{actions}</div>}
            </div>
            {flash && <Alert flash={flash} onClose={() => setFlash(null)} />}
        </div>
    );
}
