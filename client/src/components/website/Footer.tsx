import { Link } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import type { SiteData } from '../../types/models';
import { publicAsset } from '../../utils/helpers';
import { NAV_LINKS } from './Header';
import { Container, Decor } from './ui';

const INFO_LINKS = [
    ['/privacy-policy', 'Privacy Policy'],
    ['/terms-and-conditions', 'Terms and Conditions'],
    ['/contact', 'Contact Us'],
] as const;

const linkClass = 'text-white transition-colors hover:text-brand';
const socialClass =
    'mt-2.5 mr-1.5 inline-flex size-[35px] items-center justify-center rounded-[10px] border border-white text-white transition-colors duration-300 hover:bg-white hover:text-black';

function FacebookIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current">
            <path d="M14 8V6c0-.9.6-1 1-1h3V1h-4c-4 0-5 3-5 5v2H6v4h3v11h5V12h3.5l.5-4z" />
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-none stroke-current" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

function Title({ children }: { children: string }) {
    return <h3 className="mb-5 text-xl/7 font-semibold text-white capitalize">{children}</h3>;
}

export default function Footer() {
    const { data } = useApi<SiteData>('/site'); // social links from Admin > Settings
    const social = data?.social ?? { facebook: '#', instagram: '#' };

    return (
        <footer className="relative isolate overflow-hidden bg-black pt-[70px]">
            <Decor
                src={publicAsset('assets/images/icons/voilet_bg.webp')}
                className="-top-[30px] left-0 h-[400px] w-[400px] object-cover sm:top-auto sm:-bottom-[50px] sm:-left-[50px] sm:h-full 3xl:-bottom-[20%] 3xl:left-[10%]"
            />
            <Container>
                <div className="grid grid-cols-2 gap-6 pb-12 lg:grid-cols-4">
                    <div className="col-span-2 text-center sm:col-span-1 sm:text-left">
                        <Link to="/" className="inline-block">
                            <img src={publicAsset('assets/images/logo_vertical.webp')} alt="CodesExperts home" className="max-w-full" loading="lazy" />
                        </Link>
                    </div>
                    <nav aria-label="Quick links">
                        <Title>Quick Links</Title>
                        <ul className="space-y-2.5 text-sm">
                            {NAV_LINKS.slice(0, 4).map(([to, label]) => (
                                <li key={to}>
                                    <Link className={linkClass} to={to}>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <nav aria-label="Information">
                        <Title>Information</Title>
                        <ul className="space-y-2.5 text-sm">
                            {INFO_LINKS.map(([to, label]) => (
                                <li key={to}>
                                    <Link className={linkClass} to={to}>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="col-span-2 sm:col-span-1">
                        <Title>Contact Us</Title>
                        <ul className="space-y-2.5 text-sm text-white">
                            <li>
                                Email:
                                <a href="mailto:support@codesexperts.com" className={`block ${linkClass}`}>
                                    support@codesexperts.com
                                </a>
                            </li>
                            <li>
                                Phone:
                                <a href="tel:+919865300888" className={`block ${linkClass}`}>
                                    +919865300888
                                </a>
                            </li>
                        </ul>
                        <div>
                            <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={socialClass}>
                                <FacebookIcon />
                            </a>
                            <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={socialClass}>
                                <InstagramIcon />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-white py-4 text-center">
                    <p className="text-white">© {new Date().getFullYear()} CODES EXPERTS. All Rights Reserved.</p>
                </div>
            </Container>
        </footer>
    );
}
