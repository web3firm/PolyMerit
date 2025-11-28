'use client';

import { Mail, BarChart2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VerifyPage() {
    return (
        <div className="min-h-screen py-16 bg-secondary flex items-center justify-center">
            <div className="w-full max-w-md px-6">
                <div className="card text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-primary/10 mb-6">
                        <Mail size={40} className="text-accent-primary" />
                    </div>

                    <h1 className="text-2xl font-bold text-primary mb-2">
                        Check Your Email
                    </h1>
                    
                    <p className="text-secondary mb-6">
                        We sent you a magic link to sign in. Click the link in the email to continue.
                    </p>

                    {/* Tips */}
                    <div className="bg-tertiary rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm font-medium text-primary mb-2">Can&apos;t find the email?</p>
                        <ul className="text-sm text-secondary space-y-1">
                            <li>• Check your spam or junk folder</li>
                            <li>• Make sure you entered the correct email</li>
                            <li>• The link expires in 24 hours</li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Link 
                            href="/auth/signin"
                            className="btn-outline w-full flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={18} />
                            Try a different email
                        </Link>
                        <Link 
                            href="/"
                            className="block text-sm text-secondary hover:text-primary transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>

                {/* Logo */}
                <div className="text-center mt-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors">
                        <div className="w-6 h-6 rounded bg-accent-primary flex items-center justify-center">
                            <BarChart2 size={14} className="text-white" />
                        </div>
                        <span className="text-sm font-medium">PolyMerit</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
