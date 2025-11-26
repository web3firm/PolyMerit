'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Activity, Search, X, Brain } from 'lucide-react';
import { Market } from '@/lib/polymarket';
import MarketCard from '@/components/MarketCard';
import SkeletonCard from '@/components/SkeletonCard';
import AIInsights from '@/components/AIInsights';

export default function ScannerPage() {
    const [markets, setMarkets] = useState<Market[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'trending' | 'new'>('trending');
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Market[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [category, setCategory] = useState<string>('all');
    const [minVolume, setMinVolume] = useState<number>(0);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
    const [showAIInsights, setShowAIInsights] = useState(false);

    // Debounced search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=12`);
                const data = await response.json();
                const marketsFromEvents = data.events?.flatMap((e: any) => e.markets || []) || [];
                setSearchResults(marketsFromEvents);
            } catch (error) {
                console.error('Search failed', error);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchMarkets = useCallback(async (reset = false) => {
        setLoading(true);
        setError(null);
        
        const currentOffset = reset ? 0 : offset;
        if (reset) setOffset(0);
        
        try {
            // Use closed=false to get active markets
            const response = await fetch(
                `/api/events?limit=12&offset=${currentOffset}&closed=false`
            );
            const events = await response.json();
            
            // Extract markets from events
            const marketsData = events.flatMap((e: any) => e.markets || []).filter((m: any) => m);
            
            if (reset) {
                setMarkets(marketsData);
            } else {
                setMarkets(prev => [...prev, ...marketsData]);
            }
            
            setHasMore(marketsData.length === 12);
            if (!reset) setOffset(currentOffset + 12);
        } catch (error) {
            console.error('Failed to fetch markets', error);
            setError('Failed to load markets. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [filter, category, minVolume, offset]);

    useEffect(() => {
        fetchMarkets(true);
    }, [filter, category, minVolume]);

    const displayMarkets = searchQuery.trim() ? searchResults : markets.filter(m => {
        const volume = parseFloat(m.volume || '0');
        if (volume < minVolume) return false;
        if (category === 'all') return true;
        return m.category?.toLowerCase() === category;
    });

    return (
        <div className="min-h-screen py-8 bg-secondary">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-primary mb-3">
                            Market Scanner
                        </h1>
                        <p className="text-lg text-secondary">
                            Discover trending markets and new opportunities in real-time
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
                            <input
                                type="text"
                                placeholder="Search markets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-12 py-3 bg-primary border border-primary rounded-xl text-primary"
                                style={{ outline: 'none' }}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                                >
                                    <X size={20} />
                                </button>
                            )}
                            {isSearching && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('trending')}
                                className={filter === 'trending' ? 'btn-primary' : 'btn-outline'}
                            >
                                <TrendingUp size={18} className="inline mr-2" />
                                Trending
                            </button>
                            <button
                                onClick={() => setFilter('new')}
                                className={filter === 'new' ? 'btn-primary' : 'btn-outline'}
                            >
                                <Activity size={18} className="inline mr-2" />
                                New Markets
                            </button>
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-secondary">Category:</span>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="px-3 py-2 bg-primary border border-primary rounded-lg text-primary"
                                style={{ outline: 'none' }}
                            >
                                <option value="all">All</option>
                                <option value="politics">Politics</option>
                                <option value="crypto">Crypto</option>
                                <option value="sports">Sports</option>
                                <option value="pop culture">Pop Culture</option>
                                <option value="science">Science</option>
                                <option value="business">Business</option>
                            </select>
                        </div>

                        {/* Volume Filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-secondary">Min Volume:</span>
                            <select
                                value={minVolume}
                                onChange={(e) => setMinVolume(Number(e.target.value))}
                                className="px-3 py-2 bg-primary border border-primary rounded-lg text-primary"
                                style={{ outline: 'none' }}
                            >
                                <option value={0}>All</option>
                                <option value={10000}>$10K+</option>
                                <option value={50000}>$50K+</option>
                                <option value={100000}>$100K+</option>
                                <option value={500000}>$500K+</option>
                                <option value={1000000}>$1M+</option>
                            </select>
                        </div>
                    </div>

                    {searchQuery && (
                        <div className="mb-6 text-gray-600">
                            {isSearching ? (
                                <span>Searching...</span>
                            ) : (
                                <span>Found {searchResults.length} results for &quot;{searchQuery}&quot;</span>
                            )}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Markets Grid */}
                    {loading && displayMarkets.length === 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : displayMarkets.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {searchQuery ? 'No markets found. Try a different search.' : 'No markets found. Try adjusting your filters.'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {displayMarkets.map((market) => {
                                    let yesPrice = 0.5;
                                    let noPrice = 0.5;
                                    try {
                                        if (typeof market.outcomePrices === 'string') {
                                            const prices = JSON.parse(market.outcomePrices);
                                            if (Array.isArray(prices) && prices.length >= 2) {
                                                yesPrice = parseFloat(prices[0]) || 0.5;
                                                noPrice = parseFloat(prices[1]) || 0.5;
                                            }
                                        } else if (Array.isArray(market.outcomePrices) && market.outcomePrices.length >= 2) {
                                            yesPrice = parseFloat(market.outcomePrices[0]) || 0.5;
                                            noPrice = parseFloat(market.outcomePrices[1]) || 0.5;
                                        }
                                    } catch (e) {
                                        console.error('Error parsing prices for market:', market.id, e);
                                    }

                                    return (
                                        <MarketCard
                                            key={market.id}
                                            title={market.question}
                                            volume={`$${parseInt(market.volume || '0').toLocaleString()}`}
                                            yesPrice={yesPrice}
                                            noPrice={noPrice}
                                            isTrending={filter === 'trending'}
                                            marketId={market.conditionId}
                                            slug={market.slug}
                                        />
                                    );
                                })}
                            </div>

                            {/* Load More Button */}
                            {!searchQuery && hasMore && !loading && (
                                <div className="mt-12 text-center">
                                    <button
                                        onClick={() => fetchMarkets(false)}
                                        className="btn-primary px-8 py-3"
                                    >
                                        Load More Markets
                                    </button>
                                </div>
                            )}

                            {loading && displayMarkets.length > 0 && (
                                <div className="mt-12 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
