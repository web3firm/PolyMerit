'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Lock } from 'lucide-react';

interface AuthRequiredProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function AuthRequired({ children, fallback }: AuthRequiredProps) {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary">
                <div className="animate-spin w-8 h-8 border-4 border-accent-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!session) {
        return fallback || (
            <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
                <div className="max-w-md w-full text-center">
                    <div className="card p-8">
                        <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock size={32} className="text-accent-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-primary mb-3">
                            Sign in Required
                        </h1>
                        <p className="text-secondary mb-6">
                            You need to be signed in to access this feature. Create a free account to save your alerts and preferences.
                        </p>
                        <Link
                            href="/auth/signin"
                            className="btn-primary w-full justify-center"
                        >
                            Sign in with Email
                        </Link>
                        <p className="text-xs text-secondary mt-4">
                            We&apos;ll send you a magic link to sign in instantly.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
