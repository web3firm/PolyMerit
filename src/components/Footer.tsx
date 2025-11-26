'use client';

import Link from 'next/link';
import { BarChart2, Github, Mail } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* Brand */}
                        <div>
                            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white mb-4">
                                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                    <BarChart2 size={20} className="text-white" />
                                </div>
                                <span>PolyMerit</span>
                            </Link>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                Enterprise-grade analytics and insights for Polymarket traders.
                            </p>
                        </div>

                        {/* Product */}
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/scanner" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">
                                        Market Scanner
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/whales" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">
                                        Whale Tracker
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/analytics" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">
                                        Analytics
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">
                                        Blog
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Connect */}
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
                            <div className="flex gap-3">
                                <a
                                    href="#"
                                    className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 hover:text-white transition-colors"
                                    aria-label="GitHub"
                                >
                                    <Github size={18} />
                                </a>
                                <a
                                    href="mailto:support@polymerit.app"
                                    className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 hover:text-white transition-colors"
                                    aria-label="Email"
                                >
                                    <Mail size={18} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            © {currentYear} PolyMerit. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
