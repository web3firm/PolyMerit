'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, BarChart2, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!email || !email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            const result = await signIn("nodemailer", {
                email,
                redirect: false,
                callbackUrl: "/",
            });

            if (result?.error) {
                setError("Failed to send magic link. Please try again.");
            } else {
                // Redirect to verify page
                window.location.href = "/auth/verify";
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-16 bg-secondary flex items-center justify-center">
            <div className="w-full max-w-md px-6">
                <div className="card">
                    {/* Logo & Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-accent-primary mb-4">
                            <BarChart2 size={32} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-primary">Welcome to PolyMerit</h1>
                        <p className="text-secondary mt-2">
                            Sign in with your email to save watchlists and get alerts
                        </p>
                    </div>

                    {/* Email Sign In Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 bg-tertiary border border-primary rounded-lg text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg">
                                <p className="text-sm text-danger">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center gap-2 py-3"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Sending Magic Link...
                                </>
                            ) : (
                                <>
                                    Continue with Email
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Info */}
                    <div className="mt-6 p-4 bg-tertiary rounded-lg">
                        <p className="text-sm text-secondary text-center">
                            🔒 We&apos;ll send you a magic link to sign in securely. No password needed!
                        </p>
                    </div>

                    {/* Terms */}
                    <p className="text-xs text-secondary text-center mt-6">
                        By signing in, you agree to our{" "}
                        <Link href="/terms" className="text-accent-primary hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-accent-primary hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-sm text-secondary hover:text-primary transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
