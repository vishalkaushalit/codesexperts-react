import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '../components/website/Header';
import Newsletter from '../components/website/Newsletter';
import Footer from '../components/website/Footer';
import useSeoMeta from '../hooks/useSeoMeta';

let aosStarted = false;

export default function WebsiteLayout() {
    const { pathname } = useLocation();
    useSeoMeta();

    useEffect(() => {
        if (!aosStarted) {
            AOS.init({ once: false });
            aosStarted = true;
        }
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        AOS.refreshHard();
        // GA4 enhanced measurement records page views on history changes, so no manual gtag call is needed.
    }, [pathname]);

    return (
        <div className="min-h-screen bg-black font-sans text-white">
            <Header />
            <main>
                <Outlet />
            </main>
            <Newsletter />
            <Footer />
        </div>
    );
}
