'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Star, Trash2, ExternalLink, Lock, TrendingUp, TrendingDown } from 'lucide-react';
import { getEventURL } from '@/lib/polymarket';

interface WatchlistItem {
    id: string;
    marketId: string;
    slug: string;
    title: string;
    createdAt: string;
}

interface MarketData {
    id: string;
    title: string;
    slug: string;
    volume: number;
    outcomePrices?: string[];
    active: boolean;
}

export default function WatchlistPage() {
    const { data: session, status } = useSession();
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [marketData, setMarketData] = useState<Map<string, MarketData>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session) {
            fetchWatchlist();
        } else {
            setLoading(false);
        }
    }, [session]);

    const fetchWatchlist = async () => {
        try {
            const res = await fetch('/api/watchlist');
            if (res.ok) {
                const data = await res.json();
                setWatchlist(data);
                // Fetch market data for each item
                await fetchMarketData(data);
            }
        } catch (error) {
            console.error('Error fetching watchlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMarketData = async (items: WatchlistItem[]) => {
        try {
            const res = await fetch('/api/events?limit=100');
            if (res.ok) {
                const events = await res.json();
                const dataMap = new Map<string, MarketData>();
                events.forEach((event: MarketData) => {
                    dataMap.set(event.id, event);
                });
                setMarketData(dataMap);
            }
        } catch (error) {
            console.error('Error fetching market data:', error);
        }
    };

    const removeFromWatchlist = async (marketId: string) => {
        try {
            const res = await fetch(`/api/watchlist?marketId=${marketId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setWatchlist(prev => prev.filter(item => item.marketId !== marketId));
            }
        } catch (error) {
            console.error('Error removing from watchlist:', error);
        }
    };

    // Not authenticated
    if (status === 'loading') {
        return (
            <div className="min-h-screen py-8 bg-secondary flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen py-16 bg-secondary">
                <div className="container mx-auto px-6">
                    <div className="max-w-md mx-auto text-center">
                        <div className="card">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-accent-primary/10 mb-4">
                                <Lock size={32} className="text-accent-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-primary mb-2">
                                Sign In Required
                            </h1>
                            <p className="text-secondary mb-6">
                                Sign in to save markets to your watchlist and track them across devices.
                            </p>
                            <Link href="/auth/signin" className="btn-primary inline-block">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 bg-secondary">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary/10 rounded-full mb-3">
                            <Star size={16} className="text-accent-primary" />
                            <span className="text-sm font-medium text-accent-primary">Your Watchlist</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                            Saved Markets
                        </h1>
                        <p className="text-secondary">
                            Track your favorite markets in one place
                        </p>
                    </div>

                    {/* Watchlist */}
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="card animate-pulse">
                                    <div className="h-6 bg-tertiary rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-tertiary rounded w-1/4"></div>
                                </div>
                            ))}
                        </div>
                    ) : watchlist.length === 0 ? (
                        <div className="card text-center py-12">
                            <Star size={48} className="mx-auto text-secondary/50 mb-4" />
                            <p className="text-lg font-semibold text-primary mb-2">
                                No markets saved yet
                            </p>
                            <p className="text-secondary mb-6">
                                Browse markets and click the star icon to add them to your watchlist.
                            </p>
                            <Link href="/scanner" className="btn-primary inline-block">
                                Browse Markets
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {watchlist.map((item) => {
                                const market = marketData.get(item.marketId);
                                const price = market?.outcomePrices?.[0] ? parseFloat(market.outcomePrices[0]) : null;
                                
                                return (
                                    <div key={item.id} className="card hover:border-accent-primary/30 transition-colors">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <Link 
                                                    href={`/market/${item.slug}`}
                                                    className="text-lg font-semibold text-primary hover:text-accent-primary transition-colors line-clamp-2"
                                                >
                                                    {item.title || market?.title || 'Unknown Market'}
                                                </Link>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-secondary">
                                                    {price !== null && (
                                                        <span className={`flex items-center gap-1 ${price > 0.5 ? 'text-success' : 'text-danger'}`}>
                                                            {price > 0.5 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                            {(price * 100).toFixed(0)}% Yes
                                                        </span>
                                                    )}
                                                    {market?.volume && (
                                                        <span>${(market.volume / 1000000).toFixed(2)}M volume</span>
                                                    )}
                                                    <span>Added {new Date(item.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={getEventURL(item.slug)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-secondary hover:text-accent-primary transition-colors"
                                                    title="View on Polymarket"
                                                >
                                                    <ExternalLink size={18} />
                                                </a>
                                                <button
                                                    onClick={() => removeFromWatchlist(item.marketId)}
                                                    className="p-2 text-secondary hover:text-danger transition-colors"
                                                    title="Remove from watchlist"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
