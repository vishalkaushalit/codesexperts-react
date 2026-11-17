import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, type LucideIcon } from 'lucide-react';
import { SIDEBAR, adminResources } from '../../config/adminResources';
import { cn } from '../../utils/helpers';

function Item({ to, icon: Icon, label, end }: { to: string; icon: LucideIcon; label: string; end?: boolean }) {
    return (
        <li>
            <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                    cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive ? 'bg-brand/15 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                    )
                }
            >
                {({ isActive }) => (
                    <>
                        <Icon aria-hidden className={cn('size-4.5 shrink-0', isActive ? 'text-brand-dark' : 'text-slate-400')} />
                        {label}
                    </>
                )}
            </NavLink>
        </li>
    );
}

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
    return (
        <>
            {/* Mobile backdrop */}
            <div className={cn('fixed inset-0 z-30 bg-slate-900/40 lg:hidden', open ? 'block' : 'hidden')} onClick={onClose} aria-hidden />
            <aside
                id="admin-sidebar"
                className={cn(
                    'fixed top-16 bottom-0 left-0 z-40 w-64 overflow-y-auto border-r border-slate-200 bg-white px-3 py-5 transition-transform lg:translate-x-0',
                    open ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <nav aria-label="Admin">
                    <ul className="space-y-1">
                        <Item to="/admin" end icon={LayoutDashboard} label="Dashboard" />
                    </ul>
                    {SIDEBAR.map((group) => (
                        <div key={group.heading} className="mt-6">
                            <p className="px-3 pb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">{group.heading}</p>
                            <ul className="space-y-1">
                                {group.items.map((key) => (
                                    <Item key={key} to={`/admin/${key}`} icon={adminResources[key].icon} label={adminResources[key].title} />
                                ))}
                            </ul>
                        </div>
                    ))}
                    <ul className="mt-6 space-y-1 border-t border-slate-200 pt-4">
                        <Item to="/admin/settings" icon={Settings} label="Settings" />
                    </ul>
                </nav>
            </aside>
        </>
    );
}
