'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, TrendingUp, DollarSign, Users, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Market, Trade, PriceHistory } from '@/lib/polymarket';

export default function MarketDetailPage() {
    const params = useParams();
    const marketId = params.id as string;
    
    const [data, setData] = useState<{
        market: Market | null;
        priceHistory: PriceHistory[];
        trades: Trade[];
    }>({
        market: null,
        priceHistory: [],
        trades: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMarketData() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/market/${marketId}`);
                if (!response.ok) {
                    throw new Error('Market not found');
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError('Failed to load market details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        if (marketId) {
            fetchMarketData();
        }
    }, [marketId]);

    if (loading) {
        return (
            <div className="min-h-screen py-12">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="animate-pulse space-y-8">
                            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-64 bg-gray-200 rounded"></div>
                            <div className="grid grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-32 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data.market) {
        return (
            <div className="min-h-screen py-12">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center py-12">
                            <p className="text-red-600 text-lg mb-4">{error || 'Market not found'}</p>
                            <Link href="/scanner" className="btn-primary">
                                <ArrowLeft size={18} />
                                Back to Scanner
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { market, priceHistory, trades } = data;
    
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
        console.error('Error parsing prices:', e);
    }

    const yesPercent = Math.round(yesPrice * 100);
    const noPercent = Math.round(noPrice * 100);

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <Link 
                        href="/scanner" 
                        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
                    >
                        <ArrowLeft size={18} />
                        Back to Markets
                    </Link>

                    {/* Market Header */}
                    <div className="card mb-8">
                        <div className="flex flex-col md:flex-row gap-6">
                            {market.image && (
                                <img 
                                    src={market.image} 
                                    alt={market.question}
                                    className="w-full md:w-48 h-48 object-cover rounded-lg"
                                />
                            )}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    {market.question}
                                </h1>
                                <p className="text-gray-600 mb-4">{market.description}</p>
                                
                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Volume</div>
                                        <div className="text-xl font-bold text-gray-900">
                                            ${parseInt(market.volume || '0').toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Liquidity</div>
                                        <div className="text-xl font-bold text-gray-900">
                                            ${parseInt(market.liquidity || '0').toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">End Date</div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {new Date(market.endDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Category</div>
                                        <div className="text-lg font-semibold text-purple-600">
                                            {market.category}
                                        </div>
                                    </div>
                                </div>

                                {/* Trade Link */}
                                <a
                                    href={`https://polymarket.com/event/${market.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary mt-4 inline-flex"
                                >
                                    <ExternalLink size={18} />
                                    Trade on Polymarket
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Price Display */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                            <div className="text-center">
                                <div className="text-green-700 font-semibold mb-2">YES</div>
                                <div className="text-5xl font-bold text-green-600 mb-2">
                                    {yesPercent}¢
                                </div>
                                <div className="text-sm text-green-700">
                                    {yesPercent}% chance
                                </div>
                            </div>
                        </div>
                        <div className="card bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                            <div className="text-center">
                                <div className="text-red-700 font-semibold mb-2">NO</div>
                                <div className="text-5xl font-bold text-red-600 mb-2">
                                    {noPercent}¢
                                </div>
                                <div className="text-sm text-red-700">
                                    {noPercent}% chance
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Trades */}
                    <div className="card">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Trades</h2>
                        {trades.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                No recent trades available
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Time
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Side
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Price
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Size
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {trades.slice(0, 10).map((trade) => (
                                            <tr key={trade.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {new Date(trade.timestamp * 1000).toLocaleTimeString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        trade.side === 'BUY'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {trade.side}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                    ${parseFloat(trade.price).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {parseFloat(trade.size).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
