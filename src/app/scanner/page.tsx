'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Activity, Search } from 'lucide-react';
import { getMarkets, Market } from '@/lib/polymarket';
import MarketCard from '@/components/MarketCard';

export default function ScannerPage() {
    const [markets, setMarkets] = useState<Market[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'trending' | 'new'>('trending');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMarkets() {
            setLoading(true);
            setError(null);
            try {
                console.log('Fetching markets with filter:', filter);
                const data = await getMarkets({
                    limit: 12,
                    order: 'DESC',
                    sort: filter === 'trending' ? 'volume' : 'createdAt',
                    active: true,
                });
                console.log('Received markets:', data.length);
                setMarkets(data);
            } catch (error) {
                console.error('Failed to fetch markets', error);
                setError('Failed to load markets. Please try again.');
            } finally {
                setLoading(false);
            }
        }
        fetchMarkets();
    }, [filter]);

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Market Scanner
                    </h1>
                    <p className="text-xl text-gray-600">
                        Discover trending markets and new opportunities in real-time
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('trending')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'trending'
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                                }`}
                        >
                            <TrendingUp size={18} className="inline mr-2" />
                            Trending
                        </button>
                        <button
                            onClick={() => setFilter('new')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'new'
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                                }`}
                        >
                            <Activity size={18} className="inline mr-2" />
                            New Markets
                        </button>
                    </div>

                    <div className="ml-auto flex-1 max-w-md">
                        <div className="relative">
                            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search markets..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {/* Markets Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="card h-64 animate-pulse bg-gray-100" />
                        ))}
                    </div>
                ) : markets.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No markets found. Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {markets.map((market) => {
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
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
