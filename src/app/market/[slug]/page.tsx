'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Activity, ExternalLink, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Market, PriceHistory, Trade } from '@/lib/polymarket';

export default function MarketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [market, setMarket] = useState<Market | null>(null);
    const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
    const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'1d' | '1w' | '1m' | 'all'>('1d');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch market details
                const marketRes = await fetch(`/api/markets?slug=${params.slug}`);
                const markets = await marketRes.json();
                if (markets && markets.length > 0) {
                    const marketData = markets[0];
                    setMarket(marketData);

                    // Fetch price history
                    const priceRes = await fetch(`/api/markets/${marketData.conditionId}/prices?interval=${timeRange}`);
                    const prices = await priceRes.json();
                    setPriceHistory(prices || []);

                    // Fetch recent trades
                    const tradesRes = await fetch(`/api/markets/${marketData.conditionId}/trades?limit=20`);
                    const trades = await tradesRes.json();
                    setRecentTrades(trades || []);
                }
            } catch (error) {
                console.error('Failed to fetch market data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) {
            fetchData();
        }
    }, [params.slug, timeRange]);

    if (loading) {
        return (
            <div className="min-h-screen py-8 bg-secondary flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
                    <div className="text-secondary">Loading market data...</div>
                </div>
            </div>
        );
    }

    if (!market) {
        return (
            <div className="min-h-screen py-8 bg-secondary">
                <div className="container mx-auto px-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-primary mb-4">Market Not Found</h1>
                        <button onClick={() => router.back()} className="btn-primary">
                            <ArrowLeft size={18} />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentPrice = market.outcomePrices?.[0] ? parseFloat(market.outcomePrices[0]) : 0.5;
    const volume = parseFloat(market.volume || '0');
    const volume24h = parseFloat(market.volume24hr || '0');
    const priceChange = market.oneDayPriceChange || 0;
    const isPositive = priceChange >= 0;

    // Format price history for chart
    const chartData = priceHistory.map(point => ({
        time: new Date(point.t * 1000).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        }),
        price: point.p,
        volume: point.v || 0
    }));

    return (
        <div className="min-h-screen py-8 bg-secondary">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <button 
                        onClick={() => router.back()} 
                        className="btn-ghost mb-6"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    {/* Market Header */}
                    <div className="card mb-8">
                        <div className="flex items-start justify-between gap-6 mb-6">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-primary mb-3">
                                    {market.question}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4">
                                    {market.category && (
                                        <span className="badge badge-accent">
                                            {market.category}
                                        </span>
                                    )}
                                    {market.tags?.slice(0, 3).map((tag) => (
                                        <span key={tag.id} className="badge">
                                            {tag.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <a
                                href={`https://polymarket.com/event/${market.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                            >
                                <ExternalLink size={18} />
                                Trade on Polymarket
                            </a>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <div className="text-sm text-secondary mb-1">Current Price</div>
                                <div className="text-2xl font-bold text-accent-primary">
                                    {(currentPrice * 100).toFixed(1)}¢
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-secondary mb-1">24h Change</div>
                                <div className={`text-2xl font-bold flex items-center gap-1 ${isPositive ? 'text-success' : 'text-danger'}`}>
                                    {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                    {Math.abs(priceChange).toFixed(2)}%
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-secondary mb-1">Total Volume</div>
                                <div className="text-2xl font-bold text-primary">
                                    ${(volume / 1000000).toFixed(2)}M
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-secondary mb-1">24h Volume</div>
                                <div className="text-2xl font-bold text-primary">
                                    ${(volume24h / 1000).toFixed(1)}K
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Price Chart */}
                    <div className="card mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-primary">Price History</h2>
                            <div className="flex gap-2">
                                {(['1d', '1w', '1m', 'all'] as const).map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={timeRange === range ? 'btn-primary' : 'btn-outline'}
                                    >
                                        {range === '1d' ? '24H' : range === '1w' ? '1W' : range === '1m' ? '1M' : 'ALL'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="rgb(139, 92, 246)" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="rgb(139, 92, 246)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--border-primary), 0.3)" />
                                    <XAxis 
                                        dataKey="time" 
                                        stroke="rgb(var(--text-secondary))"
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis 
                                        domain={[0, 1]}
                                        tickFormatter={(value) => `${(value * 100).toFixed(0)}¢`}
                                        stroke="rgb(var(--text-secondary))"
                                        tick={{ fontSize: 12 }}
                                    />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: 'rgb(var(--bg-primary))',
                                            border: '1px solid rgb(var(--border-primary))',
                                            borderRadius: '8px',
                                            color: 'rgb(var(--text-primary))'
                                        }}
                                        formatter={(value: number) => [`${(value * 100).toFixed(2)}¢`, 'Price']}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="price" 
                                        stroke="rgb(139, 92, 246)" 
                                        strokeWidth={2}
                                        fill="url(#colorPrice)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-secondary">
                                No price history available for this market
                            </div>
                        )}
                    </div>

                    {/* Recent Trades */}
                    {recentTrades.length > 0 && (
                        <div className="card">
                            <h2 className="text-xl font-bold text-primary mb-6">Recent Trades</h2>
                            <div className="space-y-3">
                                {recentTrades.map((trade) => {
                                    const price = parseFloat(trade.price || '0');
                                    const size = parseFloat(trade.size || '0');
                                    const value = price * size;
                                    
                                    return (
                                        <div 
                                            key={trade.id}
                                            className="flex items-center justify-between p-4 bg-tertiary rounded-lg"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    trade.side === 'BUY' 
                                                        ? 'bg-success/10 text-success' 
                                                        : 'bg-danger/10 text-danger'
                                                }`}>
                                                    {trade.side}
                                                </span>
                                                <div>
                                                    <div className="text-sm font-medium text-primary">
                                                        {(price * 100).toFixed(1)}¢
                                                    </div>
                                                    <div className="text-xs text-secondary">
                                                        ${value.toFixed(0)} value
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-secondary">
                                                <Clock size={14} className="inline mr-1" />
                                                {new Date(trade.timestamp * 1000).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {market.description && (
                        <div className="card mt-8">
                            <h2 className="text-xl font-bold text-primary mb-4">About This Market</h2>
                            <p className="text-secondary leading-relaxed">
                                {market.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
