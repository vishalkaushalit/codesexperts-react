import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ExternalLink, LogOut, Menu, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { publicAsset } from '../../utils/helpers';

export default function Topbar({ onToggleSidebar, sidebarOpen }: { onToggleSidebar: () => void; sidebarOpen: boolean }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const close = (e: MouseEvent) => {
            if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
        document.addEventListener('mousedown', close);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', close);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const signOut = async () => {
        await logout();
        navigate('/admin/login', { replace: true });
    };

    const initials = (user?.name ?? '?')
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4">
            <button
                type="button"
                onClick={onToggleSidebar}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                aria-label="Toggle sidebar"
                aria-controls="admin-sidebar"
                aria-expanded={sidebarOpen}
            >
                <Menu className="size-5" />
            </button>
            <Link to="/admin" className="flex items-center gap-2">
                <img src={publicAsset('assets/images/logo_horizontal.webp')} alt="CodesExperts admin" className="h-9 rounded bg-black px-2 py-1" />
            </Link>

            <div className="ml-auto flex items-center gap-2">
                <a href="/" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 sm:flex">
                    View website <ExternalLink aria-hidden className="size-3.5" />
                </a>

                <div className="relative" ref={menuRef}>
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100"
                        aria-haspopup="menu"
                        aria-expanded={open}
                        onClick={() => setOpen((o) => !o)}
                    >
                        <span className="grid size-8 place-items-center rounded-full bg-slate-900 text-xs font-semibold text-white">{initials}</span>
                        <span className="hidden text-sm font-medium text-slate-700 sm:block">{user?.name}</span>
                        <ChevronDown aria-hidden className="size-4 text-slate-400" />
                    </button>

                    {open && (
                        <div role="menu" className="absolute right-0 mt-2 w-60 rounded-xl bg-white py-1 shadow-lg ring-1 ring-slate-200">
                            <div className="border-b border-slate-100 px-4 py-3">
                                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                                <p className="truncate text-xs text-slate-500">{user?.email}</p>
                            </div>
                            <Link
                                role="menuitem"
                                to="/admin/profile"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                                <User aria-hidden className="size-4 text-slate-400" /> My profile
                            </Link>
                            <button
                                role="menuitem"
                                type="button"
                                onClick={signOut}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                            >
                                <LogOut aria-hidden className="size-4 text-slate-400" /> Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
