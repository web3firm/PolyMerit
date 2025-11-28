'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, Menu, Moon, Sun, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function NavBar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { data: session, status } = useSession();
    const [unreadAlerts, setUnreadAlerts] = useState(0);

    useEffect(() => {
        // Check for unread alerts
        const checkAlerts = () => {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('polymerit_alerts');
                if (stored) {
                    const alerts = JSON.parse(stored);
                    const unread = alerts.filter((a: { read: boolean }) => !a.read).length;
                    setUnreadAlerts(unread);
                }
            }
        };
        checkAlerts();
        // Check every 30 seconds
        const interval = setInterval(checkAlerts, 30000);
        return () => clearInterval(interval);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Scanner', href: '/scanner' },
        { name: 'Whales', href: '/whales' },
        { name: 'Analytics', href: '/analytics' },
        { name: 'Alerts', href: '/alerts' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-primary border-b border-primary shadow-sm">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgb(var(--accent-primary))' }}>
                            <BarChart2 size={20} className="text-white" />
                        </div>
                        <span>PolyMerit</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors nav-link relative ${
                                    pathname === link.href ? 'active' : ''
                                }`}
                            >
                                {link.name}
                                {link.href === '/alerts' && unreadAlerts > 0 && (
                                    <span className="absolute -top-2 -right-3 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {unreadAlerts > 9 ? '9+' : unreadAlerts}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Theme Toggle - Desktop Only */}
                        <button
                            onClick={toggleTheme}
                            className="hidden lg:flex p-2 rounded-lg transition-colors btn-ghost"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <Moon size={20} className="text-secondary" />
                            ) : (
                                <Sun size={20} className="text-secondary" />
                            )}
                        </button>

                        {/* User Menu - Desktop Only */}
                        <div className="hidden lg:block relative">
                            {status === 'loading' ? (
                                <div className="w-8 h-8 rounded-full bg-tertiary animate-pulse" />
                            ) : session ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 p-1 rounded-full hover:bg-tertiary transition-colors"
                                    >
                                        {session.user?.image ? (
                                            <Image
                                                src={session.user.image}
                                                alt={session.user.name || 'User'}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center">
                                                <User size={16} className="text-white" />
                                            </div>
                                        )}
                                    </button>
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-primary border border-primary rounded-lg shadow-lg py-2 z-50">
                                            <div className="px-4 py-2 border-b border-primary">
                                                <p className="text-sm font-medium text-primary truncate">
                                                    {session.user?.name || session.user?.email?.split('@')[0] || 'User'}
                                                </p>
                                                <p className="text-xs text-secondary truncate">
                                                    {session.user?.email}
                                                </p>
                                            </div>
                                            <Link
                                                href="/watchlist"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:bg-tertiary hover:text-primary transition-colors"
                                            >
                                                My Watchlist
                                            </Link>
                                            <Link
                                                href="/builder"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:bg-tertiary hover:text-primary transition-colors"
                                            >
                                                Builder Dashboard
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                    signOut();
                                                }}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-tertiary transition-colors"
                                            >
                                                <LogOut size={16} />
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/auth/signin"
                                    className="btn-primary text-sm px-4 py-2"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>

                        {/* Hamburger Button - Mobile Only */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`lg:hidden p-2 rounded-lg transition-all ${
                                isMenuOpen 
                                    ? 'bg-accent-primary/10 ring-2 ring-accent-primary/20' 
                                    : 'btn-ghost'
                            }`}
                            aria-label="Toggle menu"
                        >
                            <Menu size={24} className={isMenuOpen ? 'text-accent-primary' : 'text-primary'} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="lg:hidden border-t border-primary bg-primary">
                    <div className="container mx-auto px-6 py-4">
                        {/* Navigation Links */}
                        <div className="flex flex-col space-y-4 mb-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`text-base font-medium transition-colors nav-link flex items-center gap-2 ${
                                        pathname === link.href ? 'active' : ''
                                    }`}
                                >
                                    {link.name}
                                    {link.href === '/alerts' && unreadAlerts > 0 && (
                                        <span className="bg-danger text-white text-xs rounded-full px-2 py-0.5">
                                            {unreadAlerts > 9 ? '9+' : unreadAlerts}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Theme Toggle */}
                        <div className="flex items-center justify-between py-4 border-t border-primary">
                            <div className="flex items-center gap-2">
                                {theme === 'light' ? (
                                    <Sun size={18} className="text-secondary" />
                                ) : (
                                    <Moon size={18} className="text-secondary" />
                                )}
                                <span className="text-sm font-medium text-secondary">
                                    {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                                </span>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                                style={{ 
                                    background: theme === 'dark' ? 'rgb(var(--accent-primary))' : 'rgb(var(--border-secondary))',
                                    boxShadow: theme === 'dark' ? '0 0 0 2px rgba(var(--accent-primary) / 0.2)' : 'none'
                                }}
                                aria-label="Toggle theme"
                            >
                                <span
                                    className="inline-block w-4 h-4 transform transition-transform bg-white rounded-full shadow-sm"
                                    style={{
                                        transform: theme === 'dark' ? 'translateX(24px)' : 'translateX(4px)'
                                    }}
                                />
                            </button>
                        </div>

                        {/* User Section - Mobile */}
                        <div className="py-4 border-t border-primary">
                            {status === 'loading' ? (
                                <div className="h-10 bg-tertiary rounded-lg animate-pulse" />
                            ) : session ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center">
                                            <User size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-primary">
                                                {session.user?.name || session.user?.email?.split('@')[0]}
                                            </p>
                                            <p className="text-xs text-secondary truncate max-w-[200px]">
                                                {session.user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href="/watchlist"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex-1 btn-outline text-sm text-center"
                                        >
                                            Watchlist
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                signOut();
                                            }}
                                            className="flex-1 btn-outline text-sm text-danger border-danger/30 hover:bg-danger/10"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href="/auth/signin"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="btn-primary w-full text-center"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
