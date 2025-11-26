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
        <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
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
                    <div className="hidden lg:flex items-center gap-8">
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

                    <div className="flex items-center gap-3">
                        {/* Hamburger Button (always visible on right) */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
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
            </div>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className="border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md">
                    <div className="container mx-auto px-6 py-4">
                        {/* Navigation Links (mobile only) */}
                        <div className="lg:hidden flex flex-col space-y-4 mb-6">
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

                        {/* Theme Toggle (always visible in dropdown) */}
                        <div className="flex items-center justify-between py-4 border-t border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center gap-2">
                                {theme === 'light' ? (
                                    <Sun size={18} className="text-gray-700 dark:text-gray-300" />
                                ) : (
                                    <Moon size={18} className="text-gray-700 dark:text-gray-300" />
                                )}
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                                </span>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 bg-gray-200 dark:bg-purple-600"
                                aria-label="Toggle theme"
                            >
                                <span
                                    className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                        }`}
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
