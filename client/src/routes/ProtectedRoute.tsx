import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingBlock } from '../components/admin/ui';
import { useAuth } from '../context/AuthContext';

/** Only renders admin pages for a logged-in user; otherwise sends them to the login page. */
export default function ProtectedRoute() {
    const { user, checking } = useAuth();
    const location = useLocation();

    if (checking) return <LoadingBlock label="Checking your session…" />;
    if (!user) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
    return <Outlet />;
}
