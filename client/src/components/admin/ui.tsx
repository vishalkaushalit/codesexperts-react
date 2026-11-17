import type { ComponentProps, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { cn } from '../../utils/helpers';

/* Admin panel building blocks (Tailwind). */

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

const variants: Record<Variant, string> = {
    primary: 'bg-brand text-black hover:bg-brand-dark',
    secondary: 'bg-white text-slate-700 ring-1 ring-slate-300 ring-inset hover:bg-slate-50',
    danger: 'bg-white text-red-600 ring-1 ring-red-200 ring-inset hover:bg-red-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
};

export const buttonClass = (variant: Variant = 'primary', size: 'sm' | 'md' = 'md') =>
    cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-60',
        size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-2 text-sm',
        variants[variant],
    );

export function Button({ variant, size, className, ...props }: ComponentProps<'button'> & { variant?: Variant; size?: 'sm' | 'md' }) {
    return <button type="button" className={cn(buttonClass(variant, size), className)} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: LinkProps & { variant?: Variant; size?: 'sm' | 'md' }) {
    return <Link className={cn(buttonClass(variant, size), className)} {...props} />;
}

export const inputClass = (invalid?: boolean) =>
    cn(
        'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 focus:outline-brand',
        invalid ? 'border-red-400' : 'border-slate-300',
    );

export function Card({ className, children }: { className?: string; children: ReactNode }) {
    return <section className={cn('rounded-xl bg-white shadow-xs ring-1 ring-slate-200', className)}>{children}</section>;
}

export function Spinner({ className }: { className?: string }) {
    return <LoaderCircle aria-hidden className={cn('size-5 animate-spin text-slate-400', className)} />;
}

export function LoadingBlock({ label = 'Loading…' }: { label?: string }) {
    return (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500" role="status">
            <Spinner /> {label}
        </div>
    );
}

export function Badge({ tone = 'slate', children }: { tone?: 'green' | 'slate'; children: ReactNode }) {
    return (
        <span
            className={cn(
                'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                tone === 'green' ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' : 'bg-slate-100 text-slate-600 ring-1 ring-slate-500/20',
            )}
        >
            {children}
        </span>
    );
}

export type Flash = { type: 'success' | 'error'; message: string };

export function Alert({ flash, onClose }: { flash: Flash; onClose?: () => void }) {
    return (
        <div
            role={flash.type === 'error' ? 'alert' : 'status'}
            className={cn(
                'flex items-start justify-between gap-3 rounded-lg px-4 py-3 text-sm',
                flash.type === 'success' ? 'bg-green-50 text-green-800 ring-1 ring-green-600/20' : 'bg-red-50 text-red-800 ring-1 ring-red-600/20',
            )}
        >
            <span>{flash.message}</span>
            {onClose && (
                <button type="button" onClick={onClose} className="shrink-0 font-medium opacity-70 hover:opacity-100" aria-label="Dismiss">
                    ✕
                </button>
            )}
        </div>
    );
}
