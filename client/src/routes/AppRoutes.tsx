import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import WebsiteLayout from '../layouts/WebsiteLayout';
import ProtectedRoute from './ProtectedRoute';

// Website pages
import Home from '../pages/website/Home';
import About from '../pages/website/About';
import Services from '../pages/website/Services';
import ServiceDetail from '../pages/website/ServiceDetail';
import WebDevelopment from '../pages/website/WebDevelopment';
import Projects from '../pages/website/Projects';
import Contact from '../pages/website/Contact';
import Blog from '../pages/website/Blog';
import PrivacyPolicy from '../pages/website/PrivacyPolicy';
import Terms from '../pages/website/Terms';
import NotFound from '../pages/website/NotFound';

// Admin panel is loaded only when visited, so website visitors don't download it.
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const Login = lazy(() => import('../pages/admin/Login'));
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const ResourceList = lazy(() => import('../pages/admin/ResourceList'));
const ResourceForm = lazy(() => import('../pages/admin/ResourceForm'));
const Settings = lazy(() => import('../pages/admin/Settings'));
const Profile = lazy(() => import('../pages/admin/Profile'));

/** Keep the public paths in sync with SITE_PATHS in server/src/routes/web.ts (sitemap + 404 status). */
export default function AppRoutes() {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route element={<WebsiteLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about-us" element={<About />} />
                    <Route path="services" element={<Services />} />
                    <Route path="services/web-development" element={<WebDevelopment />} />
                    <Route path="services/digital-marketing" element={<ServiceDetail title="Digital Marketing" />} />
                    <Route path="services/ui-ux-design" element={<ServiceDetail title="UI/UX Design" />} />
                    <Route path="services/ecommerce-solutions" element={<ServiceDetail title="Ecommerce Solutions" />} />
                    <Route path="services/video-editing-and-motion-graphics" element={<ServiceDetail title="Video Editing & Motion Graphics" />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="terms-and-conditions" element={<Terms />} />
                    <Route path="*" element={<NotFound />} />
                </Route>

                <Route path="admin/login" element={<Login />} />
                <Route path="admin" element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path=":resource" element={<ResourceList />} />
                        <Route path=":resource/new" element={<ResourceForm />} />
                        <Route path=":resource/:id/edit" element={<ResourceForm />} />
                        <Route path="*" element={<Navigate to="/admin" replace />} />
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
}
