'use client';

import { useState, useEffect } from 'react';
import { 
    DollarSign, 
    TrendingUp, 
    Users, 
    ExternalLink, 
    Link as LinkIcon, 
    Copy, 
    Check,
    BarChart2,
    Zap,
    Info
} from 'lucide-react';
import Link from 'next/link';
import { AuthRequired } from '@/components/AuthRequired';

interface ReferralStats {
    totalClicks: number;
    uniqueVisitors: number;
    estimatedVolume: number;
    potentialEarnings: number;
}

function BuilderContent() {
    const [stats, setStats] = useState<ReferralStats>({
        totalClicks: 0,
        uniqueVisitors: 0,
        estimatedVolume: 0,
        potentialEarnings: 0,
    });
    const [copied, setCopied] = useState(false);
    const builderName = process.env.NEXT_PUBLIC_BUILDER_NAME || 'polymerit';
    const referralLink = `https://polymarket.com?via=${builderName}`;

    useEffect(() => {
        // Load stats from localStorage (simulated tracking)
        const stored = localStorage.getItem('polymerit_referral_stats');
        if (stored) {
            setStats(JSON.parse(stored));
        }

        // Track this page view
        const views = parseInt(localStorage.getItem('polymerit_builder_views') || '0');
        localStorage.setItem('polymerit_builder_views', (views + 1).toString());
    }, []);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Simulate tracking a click (for demo purposes)
    const trackClick = () => {
        const newStats = {
            ...stats,
            totalClicks: stats.totalClicks + 1,
            uniqueVisitors: stats.uniqueVisitors + (Math.random() > 0.3 ? 1 : 0),
            estimatedVolume: stats.estimatedVolume + Math.floor(Math.random() * 1000),
            potentialEarnings: 0,
        };
        // Polymarket builder rewards are based on volume - typically 0.01-0.05%
        newStats.potentialEarnings = newStats.estimatedVolume * 0.0003;
        setStats(newStats);
        localStorage.setItem('polymerit_referral_stats', JSON.stringify(newStats));
    };

    return (
        <div className="min-h-screen py-8 bg-secondary">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary/10 rounded-full mb-3">
                            <Zap size={16} className="text-accent-primary" />
                            <span className="text-sm font-medium text-accent-primary">Builder Program</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                            Referral Dashboard
                        </h1>
                        <p className="text-secondary">
                            Track your builder program referrals and potential earnings
                        </p>
                    </div>

                    {/* Info Banner */}
                    <div className="card bg-accent-primary/5 border-accent-primary/20 mb-6">
                        <div className="flex items-start gap-3">
                            <Info size={24} className="text-accent-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-primary mb-1">How Builder Rewards Work</p>
                                <p className="text-sm text-secondary">
                                    Polymarket&apos;s Builder Program rewards developers who bring trading volume to the platform. 
                                    When users trade through links with your <code className="bg-tertiary px-1 rounded">?via={builderName}</code> parameter, 
                                    you earn a percentage of the trading fees. All links on PolyMerit include your builder attribution.
                                </p>
                                <a 
                                    href="https://docs.polymarket.com/#builder-rewards"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-accent-primary hover:underline mt-2"
                                >
                                    Learn more about Builder Rewards
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="card">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-accent-primary/10 rounded-lg">
                                    <LinkIcon size={24} className="text-accent-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-secondary">Total Clicks</p>
                                    <p className="text-2xl font-bold text-primary">{stats.totalClicks}</p>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-success/10 rounded-lg">
                                    <Users size={24} className="text-success" />
                                </div>
                                <div>
                                    <p className="text-sm text-secondary">Unique Visitors</p>
                                    <p className="text-2xl font-bold text-primary">{stats.uniqueVisitors}</p>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-warning/10 rounded-lg">
                                    <BarChart2 size={24} className="text-warning" />
                                </div>
                                <div>
                                    <p className="text-sm text-secondary">Est. Volume</p>
                                    <p className="text-2xl font-bold text-primary">
                                        ${stats.estimatedVolume.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-success/10 rounded-lg">
                                    <DollarSign size={24} className="text-success" />
                                </div>
                                <div>
                                    <p className="text-sm text-secondary">Potential Earnings</p>
                                    <p className="text-2xl font-bold text-success">
                                        ${stats.potentialEarnings.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Referral Link */}
                    <div className="card mb-8">
                        <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                            <LinkIcon size={20} className="text-accent-primary" />
                            Your Referral Link
                        </h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={referralLink}
                                readOnly
                                className="flex-1 px-4 py-3 bg-tertiary border border-primary rounded-lg text-primary font-mono text-sm"
                            />
                            <button
                                onClick={() => copyToClipboard(referralLink)}
                                className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                                    copied 
                                        ? 'bg-success text-white' 
                                        : 'bg-accent-primary text-white hover:bg-accent-primary/90'
                                }`}
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <p className="text-sm text-secondary mt-3">
                            Share this link to earn rewards when users trade on Polymarket
                        </p>
                    </div>

                    {/* Attribution Status */}
                    <div className="card mb-8">
                        <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-accent-primary" />
                            Attribution Status
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Check size={20} className="text-success" />
                                    <span className="text-primary">Builder Name</span>
                                </div>
                                <span className="font-mono text-success">{builderName}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Check size={20} className="text-success" />
                                    <span className="text-primary">Market Links</span>
                                </div>
                                <span className="text-success">Attribution Active</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Check size={20} className="text-success" />
                                    <span className="text-primary">Profile Links</span>
                                </div>
                                <span className="text-success">Attribution Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-primary mb-4">
                            Quick Actions
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Link
                                href="/scanner"
                                className="p-4 bg-tertiary rounded-lg hover:bg-tertiary/80 transition-colors group"
                            >
                                <p className="font-semibold text-primary group-hover:text-accent-primary transition-colors">
                                    Browse Markets
                                </p>
                                <p className="text-sm text-secondary">
                                    Find hot markets to share
                                </p>
                            </Link>
                            <Link
                                href="/whales"
                                className="p-4 bg-tertiary rounded-lg hover:bg-tertiary/80 transition-colors group"
                            >
                                <p className="font-semibold text-primary group-hover:text-accent-primary transition-colors">
                                    Whale Tracker
                                </p>
                                <p className="text-sm text-secondary">
                                    Follow smart money
                                </p>
                            </Link>
                            <a
                                href="https://polymarket.com/profile"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 bg-tertiary rounded-lg hover:bg-tertiary/80 transition-colors group"
                            >
                                <p className="font-semibold text-primary group-hover:text-accent-primary transition-colors flex items-center gap-2">
                                    Polymarket Dashboard
                                    <ExternalLink size={14} />
                                </p>
                                <p className="text-sm text-secondary">
                                    View your actual earnings
                                </p>
                            </a>
                            <a
                                href="https://docs.polymarket.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 bg-tertiary rounded-lg hover:bg-tertiary/80 transition-colors group"
                            >
                                <p className="font-semibold text-primary group-hover:text-accent-primary transition-colors flex items-center gap-2">
                                    API Documentation
                                    <ExternalLink size={14} />
                                </p>
                                <p className="text-sm text-secondary">
                                    Build more integrations
                                </p>
                            </a>
                        </div>
                    </div>

                    {/* Demo Button (for testing) */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={trackClick}
                            className="btn-outline text-sm"
                        >
                            Simulate Referral Click (Demo)
                        </button>
                        <p className="text-xs text-secondary mt-2">
                            This simulates tracking for demonstration purposes
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BuilderPage() {
    return (
        <AuthRequired>
            <BuilderContent />
        </AuthRequired>
    );
}
