import Link from 'next/link';
import { BarChart2, Twitter, Github, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-20">
            <div className="container mx-auto px-6 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 mb-4">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                <BarChart2 size={20} className="text-white" />
                            </div>
                            <span>PolyMerit</span>
                        </Link>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Enterprise-grade analytics and insights for Polymarket traders.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/scanner" className="text-gray-600 hover:text-purple-600 text-sm transition-colors">
                                    Market Scanner
                                </Link>
                            </li>
                            <li>
                                <Link href="/whales" className="text-gray-600 hover:text-purple-600 text-sm transition-colors">
                                    Whale Tracker
                                </Link>
                            </li>
                            <li>
                                <Link href="/analytics" className="text-gray-600 hover:text-purple-600 text-sm transition-colors">
                                    Analytics
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-600 hover:text-purple-600 text-sm transition-colors">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-purple-600 text-sm transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-purple-600 text-sm transition-colors">
                                    Careers
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-purple-600 hover:text-white transition-colors"
                            >
                                <Twitter size={18} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-purple-600 hover:text-white transition-colors"
                            >
                                <Github size={18} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-purple-600 hover:text-white transition-colors"
                            >
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 text-sm">
                        © 2024 PolyMerit. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-600 hover:text-purple-600 text-sm transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-600 hover:text-purple-600 text-sm transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
