'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, Menu, X, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function NavBar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Scanner', href: '/scanner' },
        { name: 'Whales', href: '/whales' },
        { name: 'Analytics', href: '/analytics' },
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
                                className={`text-sm font-medium transition-colors nav-link ${
                                    pathname === link.href ? 'active' : ''
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Hamburger Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg transition-colors btn-ghost"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <X size={24} className="text-primary" />
                            ) : (
                                <Menu size={24} className="text-primary" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className="border-t border-primary bg-primary">
                    <div className="container mx-auto px-6 py-4">
                        {/* Navigation Links (mobile only) */}
                        <div className="lg:hidden flex flex-col space-y-4 mb-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`text-base font-medium transition-colors nav-link ${
                                        pathname === link.href ? 'active' : ''
                                    }`}
                                >
                                    {link.name}
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
                                <span className="sr-only">Toggle theme</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
