import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Topbar from '../components/admin/Topbar';
import { setPageMeta } from '../hooks/useSeoMeta';

/** Light admin theme; the page background is swapped while the admin is open. */
export function useAdminChrome() {
    useEffect(() => {
        setPageMeta('Admin | CodesExperts', 'noindex, nofollow');
        document.body.classList.add('bg-slate-50');
        return () => document.body.classList.remove('bg-slate-50');
    }, []);
}

export default function AdminLayout() {
    useAdminChrome();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        setSidebarOpen(false);
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <Topbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((o) => !o)} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="px-4 pt-22 pb-10 sm:px-6 lg:ml-64 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
