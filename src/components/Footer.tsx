'use client';

import Link from 'next/link';
import { BarChart2, Mail } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary border-t border-primary">
            <div className="container mx-auto px-6 py-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-6">
                        {/* Brand */}
                        <div>
                            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary mb-4">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgb(var(--accent-primary))' }}>
                                    <BarChart2 size={20} className="text-white" />
                                </div>
                                <span>PolyMerit</span>
                            </Link>
                            <p className="text-secondary text-sm leading-relaxed">
                                Enterprise-grade analytics and insights for Polymarket traders.
                            </p>
                        </div>

                        {/* Product */}
                        <div>
                            <h3 className="font-semibold text-primary mb-3 text-sm">Product</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/scanner" className="text-secondary hover:text-accent text-sm transition-colors">
                                        Market Scanner
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/whales" className="text-secondary hover:text-accent text-sm transition-colors">
                                        Whale Tracker
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/analytics" className="text-secondary hover:text-accent text-sm transition-colors">
                                        Analytics
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="font-semibold text-primary mb-3 text-sm">Company</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/contact" className="text-secondary hover:text-accent text-sm transition-colors">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <a href="#" className="text-secondary hover:text-accent text-sm transition-colors">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-secondary hover:text-accent text-sm transition-colors">
                                        Blog
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Connect */}
                        <div>
                            <h3 className="font-semibold text-primary mb-3 text-sm">Connect</h3>
                            <div className="flex gap-2">
                                <a
                                    href="https://twitter.com/polymerit"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center transition-all hover:shadow-md"
                                    style={{ 
                                        color: 'rgb(var(--text-secondary))',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgb(var(--accent-primary))';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgb(var(--bg-secondary))';
                                        e.currentTarget.style.color = 'rgb(var(--text-secondary))';
                                    }}
                                    aria-label="Twitter/X"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                </a>
                                <a
                                    href="mailto:support@polymerit.app"
                                    className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center transition-all hover:shadow-md"
                                    style={{ 
                                        color: 'rgb(var(--text-secondary))',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgb(var(--accent-primary))';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgb(var(--bg-secondary))';
                                        e.currentTarget.style.color = 'rgb(var(--text-secondary))';
                                    }}
                                    aria-label="Email"
                                >
                                    <Mail size={14} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="border-t border-primary mt-6 pt-4 flex flex-col md:flex-row justify-between items-center gap-3">
                        <p className="text-secondary text-sm">
                            © {currentYear} PolyMerit. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="text-secondary hover:text-accent text-sm transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-secondary hover:text-accent text-sm transition-colors">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
