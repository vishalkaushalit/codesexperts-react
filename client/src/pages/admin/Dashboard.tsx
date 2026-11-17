import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Images, Inbox, Mail, MessageSquareQuote, type LucideIcon } from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import { Card, LoadingBlock } from '../../components/admin/ui';
import { useAuth } from '../../context/AuthContext';
import useApi from '../../hooks/useApi';
import type { DashboardData } from '../../types/models';
import { formatDate } from '../../utils/helpers';

const STATS: Array<{ key: keyof DashboardData['counts']; label: string; icon: LucideIcon; to: string }> = [
    { key: 'enquiries', label: 'Enquiries', icon: Inbox, to: '/admin/enquiries' },
    { key: 'subscribers', label: 'Subscribers', icon: Mail, to: '/admin/subscribers' },
    { key: 'projects', label: 'Projects', icon: Images, to: '/admin/projects' },
    { key: 'services', label: 'Services', icon: Briefcase, to: '/admin/services' },
    { key: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, to: '/admin/testimonials' },
];

export default function Dashboard() {
    const { user } = useAuth();
    const { data, error, loading } = useApi<DashboardData>('/admin/dashboard');

    return (
        <>
            <PageHeader title={`Welcome back, ${user?.name?.split(' ')[0] ?? ''}`} description="Here’s what’s on the website right now." />

            {loading && <LoadingBlock />}
            {error && <p className="text-sm text-red-600">{error.message}</p>}

            {data && (
                <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {STATS.map(({ key, label, icon: Icon, to }) => (
                            <Link key={key} to={to} className="group rounded-xl bg-white p-4 shadow-xs ring-1 ring-slate-200 transition hover:ring-brand">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-500">{label}</p>
                                    <Icon aria-hidden className="size-4 text-slate-400 group-hover:text-brand-dark" />
                                </div>
                                <p className="mt-2 text-3xl font-semibold text-slate-900 tabular-nums">{data.counts[key]}</p>
                            </Link>
                        ))}
                    </div>

                    <Card>
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <h2 className="font-semibold text-slate-900">Latest enquiries</h2>
                            <Link to="/admin/enquiries" className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900">
                                View all <ArrowRight aria-hidden className="size-4" />
                            </Link>
                        </div>
                        {data.latestEnquiries.length === 0 ? (
                            <p className="px-5 py-10 text-center text-sm text-slate-500">No enquiries yet. Submissions from the Contact page will appear here.</p>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {data.latestEnquiries.map((e) => (
                                    <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-slate-900">
                                                {e.name} <span className="font-normal text-slate-500">· {e.email}</span>
                                            </p>
                                            <p className="truncate text-sm text-slate-600">{e.subject}</p>
                                        </div>
                                        <p className="shrink-0 text-xs text-slate-500">{formatDate(e.created_at)}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                </div>
            )}
        </>
    );
}
