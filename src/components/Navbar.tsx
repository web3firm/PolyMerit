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
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <BarChart2 size={20} className="text-white" />
                        </div>
                        <span>PolyMerit</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${pathname === link.href
                                        ? 'text-purple-600 dark:text-purple-400'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <button className="btn-ghost text-sm px-4 py-2">
                            Sign In
                        </button>
                        <button className="btn-primary text-sm px-4 py-2">
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X size={24} className="text-gray-900 dark:text-white" />
                        ) : (
                            <Menu size={24} className="text-gray-900 dark:text-white" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-6 py-4">
                        {/* Mobile Navigation Links */}
                        <div className="flex flex-col space-y-4 mb-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`text-base font-medium transition-colors ${pathname === link.href
                                            ? 'text-purple-600 dark:text-purple-400'
                                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Dark Mode Toggle */}
                        <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Dark Mode
                            </span>
                            <button
                                onClick={toggleTheme}
                                className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 bg-gray-200 dark:bg-purple-600"
                                aria-label="Toggle dark mode"
                            >
                                <span
                                    className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                                <span className="sr-only">Toggle dark mode</span>
                            </button>
                        </div>

                        {/* Mobile CTA Buttons */}
                        <div className="flex flex-col gap-3 pt-4">
                            <button className="btn-ghost text-sm px-4 py-2 w-full">
                                Sign In
                            </button>
                            <button className="btn-primary text-sm px-4 py-2 w-full">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
