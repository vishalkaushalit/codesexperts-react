import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn, publicAsset } from '../../utils/helpers';
import { ButtonLink, Container } from './ui';

export const NAV_LINKS = [
    ['/', 'Home'],
    ['/about-us', 'About Us'],
    ['/services', 'Services'],
    ['/projects', 'Projects'],
    ['/contact', 'Contact Us'],
] as const;

export default function Header() {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();
    useEffect(() => setOpen(false), [pathname]);

    return (
        <header className="fixed z-50 w-full bg-black/60 lg:bg-black/45">
            <Container>
                <nav className="flex flex-wrap items-center justify-between py-2 lg:flex-nowrap" aria-label="Main">
                    <Link to="/" className="py-1.5">
                        <img src={publicAsset('assets/images/logo_horizontal.webp')} alt="CodesExperts home" className="max-w-[120px] sm:max-w-[150px]" />
                    </Link>
                    <button
                        type="button"
                        className="rounded-md border border-white px-3 py-1 text-white lg:hidden"
                        aria-controls="main-menu"
                        aria-expanded={open}
                        aria-label="Toggle navigation"
                        onClick={() => setOpen((o) => !o)}
                    >
                        {open ? <X className="size-7" /> : <Menu className="size-7" />}
                    </button>
                    <div id="main-menu" className={cn('w-full items-center lg:flex lg:w-auto lg:grow', open ? 'block' : 'hidden')}>
                        <ul className="flex flex-col lg:mx-auto lg:flex-row">
                            {NAV_LINKS.map(([to, label]) => (
                                <li key={to}>
                                    <NavLink
                                        to={to}
                                        end
                                        className={({ isActive }) =>
                                            cn('mx-[5px] block px-2 py-2 text-sm font-medium transition-colors hover:text-brand', isActive ? 'text-brand' : 'text-white')
                                        }
                                    >
                                        {label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                        <ButtonLink to="/admin/login" className="my-2 lg:my-0">
                            Login
                        </ButtonLink>
                    </div>
                </nav>
            </Container>
        </header>
    );
}
