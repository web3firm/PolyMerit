'use client';

import { useSearchParams } from 'next/navigation';
import { AlertTriangle, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const errorMessages: Record<string, string> = {
        Configuration: 'There is a problem with the server configuration.',
        AccessDenied: 'You do not have access to this resource.',
        Verification: 'The verification link has expired or has already been used.',
        Default: 'An error occurred during authentication.',
    };

    const errorMessage = errorMessages[error || 'Default'] || errorMessages.Default;

    return (
        <div className="min-h-screen py-16 bg-secondary flex items-center justify-center">
            <div className="w-full max-w-md px-6">
                <div className="card text-center">
                    {/* Error Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-danger/10 mb-4">
                        <AlertTriangle size={32} className="text-danger" />
                    </div>

                    <h1 className="text-2xl font-bold text-primary mb-2">
                        Authentication Error
                    </h1>
                    <p className="text-secondary mb-6">
                        {errorMessage}
                    </p>

                    {error && (
                        <div className="p-3 bg-tertiary rounded-lg text-sm text-secondary mb-6">
                            Error code: <code className="text-danger">{error}</code>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Link href="/auth/signin" className="btn-primary block w-full">
                            Try Again
                        </Link>
                        <Link href="/" className="btn-outline block w-full">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen py-16 bg-secondary flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
            </div>
        }>
            <ErrorContent />
        </Suspense>
    );
}
