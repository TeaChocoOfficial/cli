// -Path: 'ui\src\components\layout\Navbar.tsx'
import { useState } from 'react';
import env from '../../secure/env';
import { useTranslation } from 'react-i18next';
import { FaBars, FaXmark } from 'react-icons/fa6';
import ThemeToggle from '../settings/ThemeToggle';
import { Link, useLocation } from 'react-router-dom';
import LanguageSwitcher from '../settings/LanguageSwitcher';

interface NavLink {
    to: string;
    label: string;
}

interface NavLinkProps {
    to: string;
    label: string;
    isActive: boolean;
    onClick?: () => void;
}

function NavLink({ to, label, onClick, isActive }: NavLinkProps) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                isActive
                    ? 'text-primary bg-primary/10 hover:text-secondary'
                    : 'text-surface-foreground hover:text-secondary'
            }`}
        >
            {label}
            {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
            )}
        </Link>
    );
}

export default function Navbar() {
    const { t } = useTranslation();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks: NavLink[] = [
        { to: '/', label: t('nav.home') },
        { to: '/dev/workspace', label: t('nav.workspace') },
        { to: '/setting', label: t('nav.setting') },
    ];

    return (
        <nav className="fixed top-0 z-50 border-b border-border/50 bg-surface/60 backdrop-blur-xl h-20 w-dvw">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 h-full flex items-center">
                <div className="flex h-16 items-center justify-between w-full">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-120">
                            <img
                                src={`${env.BASE_URL}TeaChoco-Developer-logo.png`}
                                className="w-full h-full"
                            />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-br from-primary to-secondary hidden sm:block">
                            {t('title')}
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                label={link.label}
                                isActive={location.pathname === link.to}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <ThemeToggle />
                        <button
                            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                        >
                            {isMenuOpen ? (
                                <FaXmark className="w-5 h-5" />
                            ) : (
                                <FaBars className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl animate-in">
                    <div className="flex flex-col gap-1 p-4">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                label={link.label}
                                onClick={() => setIsMenuOpen(false)}
                                isActive={location.pathname === link.to}
                            />
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
