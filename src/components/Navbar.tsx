'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2 } from 'lucide-react';

export default function NavBar() {
    const pathname = usePathname();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Scanner', href: '/scanner' },
        { name: 'Whales', href: '/whales' },
        { name: 'Analytics', href: '/analytics' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <BarChart2 size={20} className="text-white" />
                        </div>
                        <span>PolyMerit</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${pathname === link.href
                                    ? 'text-purple-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-3">
                        <button className="btn-ghost text-sm px-4 py-2">
                            Sign In
                        </button>
                        <button className="btn-primary text-sm px-4 py-2">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
