'use client';

import { useState, useEffect } from 'react';
import { BarChart2, Activity, TrendingUp, TrendingDown, DollarSign, Users, Layers, RefreshCw, PieChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from 'recharts';
import { Event, Trade } from '@/lib/polymarket';

interface MarketStats {
    totalVolume: number;
    totalMarkets: number;
    activeMarkets: number;
    avgVolume: number;
}

interface CategoryData {
    name: string;
    volume: number;
    count: number;
    color: string;
    [key: string]: string | number; // Index signature for Recharts compatibility
}

const CATEGORY_COLORS: Record<string, string> = {
    'Politics': '#8B5CF6',
    'Sports': '#22C55E',
    'Crypto': '#F59E0B',
    'Finance': '#3B82F6',
    'Culture': '#EC4899',
    'Science': '#06B6D4',
    'Other': '#6B7280',
};

export default function AnalyticsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState<'1H' | '4H' | '1D' | '1W'>('1D');
    const [stats, setStats] = useState<MarketStats>({ totalVolume: 0, totalMarkets: 0, activeMarkets: 0, avgVolume: 0 });
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [volumeHistory, setVolumeHistory] = useState<{ time: string; volume: number; trades: number }[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [eventsRes, tradesRes] = await Promise.all([
                fetch('/api/events?limit=100&closed=false'),
                fetch('/api/whales?limit=100')
            ]);

            const eventsData: Event[] = await eventsRes.json();
            const tradesData: Trade[] = await tradesRes.json();

            setEvents(eventsData);
            setTrades(tradesData);

            // Calculate stats
            const totalVolume = eventsData.reduce((sum, e) => sum + (e.volume || 0), 0);
            const activeMarkets = eventsData.filter(e => e.active && !e.closed).length;

            setStats({
                totalVolume,
                totalMarkets: eventsData.length,
                activeMarkets,
                avgVolume: eventsData.length > 0 ? totalVolume / eventsData.length : 0
            });

            // Calculate category distribution
            const categoryMap = new Map<string, { volume: number; count: number }>();
            eventsData.forEach(event => {
                const category = event.category || 'Other';
                const existing = categoryMap.get(category) || { volume: 0, count: 0 };
                categoryMap.set(category, {
                    volume: existing.volume + (event.volume || 0),
                    count: existing.count + 1
                });
            });

            const categories: CategoryData[] = Array.from(categoryMap.entries())
                .map(([name, data]) => ({
                    name,
                    volume: data.volume,
                    count: data.count,
                    color: CATEGORY_COLORS[name] || CATEGORY_COLORS['Other']
                }))
                .sort((a, b) => b.volume - a.volume);

            setCategoryData(categories);

            // Generate volume history from trades
            const now = Date.now();
            const hourMs = 60 * 60 * 1000;
            const history: { time: string; volume: number; trades: number }[] = [];

            for (let i = 23; i >= 0; i--) {
                const hourStart = now - (i + 1) * hourMs;
                const hourEnd = now - i * hourMs;
                const hourTrades = tradesData.filter(t => {
                    const timestamp = t.timestamp * 1000;
                    return timestamp >= hourStart && timestamp < hourEnd;
                });

                const hourVolume = hourTrades.reduce((sum, t) => {
                    return sum + parseFloat(t.size || '0') * parseFloat(t.price || '0');
                }, 0);

                const hour = new Date(hourEnd).getHours();
                history.push({
                    time: `${hour}:00`,
                    volume: Math.round(hourVolume),
                    trades: hourTrades.length
                });
            }

            setVolumeHistory(history);

        } catch (error) {
            console.error('Failed to fetch analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate buy/sell ratio
    const buyTrades = trades.filter(t => t.side === 'BUY').length;
    const sellTrades = trades.filter(t => t.side === 'SELL').length;
    const totalTrades = buyTrades + sellTrades;
    const buyRatio = totalTrades > 0 ? (buyTrades / totalTrades) * 100 : 50;

    // Top markets by volume
    const topMarkets = [...events]
        .sort((a, b) => (b.volume || 0) - (a.volume || 0))
        .slice(0, 5);

    return (
        <div className="min-h-screen py-8 bg-secondary">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary/10 rounded-full mb-3">
                                    <BarChart2 size={16} className="text-accent-primary" />
                                    <span className="text-sm font-medium text-accent-primary">Live Analytics</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-primary">
                                    Market Intelligence
                                </h1>
                            </div>
                            <button
                                onClick={fetchData}
                                disabled={loading}
                                className="btn-outline flex items-center gap-2"
                            >
                                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                                Refresh
                            </button>
                        </div>
                        <p className="text-secondary">
                            Real-time market analysis, volume trends, and trading activity
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="card">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-accent-primary/10 rounded-lg">
                                    <DollarSign size={24} className="text-accent-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-secondary">Total Volume</p>
                                    <p className="text-2xl font-bold text-primary">
                                        ${(stats.totalVolume / 1000000000).toFixed(2)}B
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-success/10 rounded-lg">
                                    <Activity size={24} className="text-success" />
                                </div>
                                <div>
                                    <p className="text-sm text-secondary">Active Markets</p>
                                    <p className="text-2xl font-bold text-primary">{stats.activeMarkets}</p>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-warning/10 rounded-lg">
                                    <Users size={24} className="text-warning" />
                                </div>
                                <div>
                                    <p className="text-sm text-secondary">Whale Trades</p>
                                    <p className="text-2xl font-bold text-primary">{trades.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-danger/10 rounded-lg">
                                    <TrendingUp size={24} className="text-danger" />
                                </div>
                                <div>
                                    <p className="text-sm text-secondary">Avg Volume</p>
                                    <p className="text-2xl font-bold text-primary">
                                        ${(stats.avgVolume / 1000000).toFixed(1)}M
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left Column - Charts */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Volume Chart */}
                            <div className="card">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                                        <BarChart2 size={20} className="text-accent-primary" />
                                        24h Volume & Activity
                                    </h3>
                                    <div className="flex gap-2">
                                        {(['1H', '4H', '1D', '1W'] as const).map((tf) => (
                                            <button
                                                key={tf}
                                                onClick={() => setTimeframe(tf)}
                                                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                                    timeframe === tf
                                                        ? 'bg-accent-primary text-white'
                                                        : 'bg-tertiary text-secondary hover:text-primary'
                                                }`}
                                            >
                                                {tf}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-72">
                                    {loading ? (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={volumeHistory}>
                                                <defs>
                                                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="rgb(139, 92, 246)" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="rgb(139, 92, 246)" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border-primary))" />
                                                <XAxis 
                                                    dataKey="time" 
                                                    stroke="rgb(var(--text-secondary))"
                                                    fontSize={12}
                                                />
                                                <YAxis 
                                                    stroke="rgb(var(--text-secondary))"
                                                    fontSize={12}
                                                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'rgb(var(--bg-primary))',
                                                        border: '1px solid rgb(var(--border-primary))',
                                                        borderRadius: '8px',
                                                        color: 'rgb(var(--text-primary))'
                                                    }}
                                                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="volume"
                                                    stroke="rgb(139, 92, 246)"
                                                    strokeWidth={2}
                                                    fill="url(#volumeGradient)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>

                            {/* Buy/Sell Flow */}
                            <div className="card">
                                <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
                                    <Activity size={20} className="text-accent-primary" />
                                    Order Flow Analysis
                                </h3>
                                <div className="space-y-4">
                                    {/* Buy/Sell Ratio Bar */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-success font-semibold flex items-center gap-1">
                                                <TrendingUp size={16} />
                                                BUY {buyRatio.toFixed(1)}%
                                            </span>
                                            <span className="text-danger font-semibold flex items-center gap-1">
                                                SELL {(100 - buyRatio).toFixed(1)}%
                                                <TrendingDown size={16} />
                                            </span>
                                        </div>
                                        <div className="h-4 bg-tertiary rounded-full overflow-hidden flex">
                                            <div 
                                                className="h-full bg-success transition-all"
                                                style={{ width: `${buyRatio}%` }}
                                            />
                                            <div 
                                                className="h-full bg-danger transition-all"
                                                style={{ width: `${100 - buyRatio}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Trade Stats */}
                                    <div className="grid grid-cols-3 gap-4 pt-4">
                                        <div className="text-center p-4 bg-tertiary rounded-lg">
                                            <p className="text-2xl font-bold text-success">{buyTrades}</p>
                                            <p className="text-xs text-secondary">Buy Orders</p>
                                        </div>
                                        <div className="text-center p-4 bg-tertiary rounded-lg">
                                            <p className="text-2xl font-bold text-danger">{sellTrades}</p>
                                            <p className="text-xs text-secondary">Sell Orders</p>
                                        </div>
                                        <div className="text-center p-4 bg-tertiary rounded-lg">
                                            <p className="text-2xl font-bold text-primary">{totalTrades}</p>
                                            <p className="text-xs text-secondary">Total Trades</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">
                            {/* Category Distribution */}
                            <div className="card">
                                <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
                                    <PieChart size={20} className="text-accent-primary" />
                                    Category Distribution
                                </h3>
                                <div className="h-48 mb-4">
                                    {loading ? (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RechartsPie>
                                                <Pie
                                                    data={categoryData.slice(0, 6)}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={40}
                                                    outerRadius={70}
                                                    dataKey="volume"
                                                    nameKey="name"
                                                >
                                                    {categoryData.slice(0, 6).map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'rgb(var(--bg-primary))',
                                                        border: '1px solid rgb(var(--border-primary))',
                                                        borderRadius: '8px',
                                                    }}
                                                    formatter={(value: number) => [`$${(value / 1000000).toFixed(1)}M`, 'Volume']}
                                                />
                                            </RechartsPie>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {categoryData.slice(0, 6).map((cat) => (
                                        <div key={cat.name} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                                <span className="text-secondary">{cat.name}</span>
                                            </div>
                                            <span className="font-semibold text-primary">{cat.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Top Markets */}
                            <div className="card">
                                <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
                                    <Layers size={20} className="text-accent-primary" />
                                    Top Markets
                                </h3>
                                <div className="space-y-3">
                                    {topMarkets.map((market, index) => (
                                        <div key={market.id} className="p-3 bg-tertiary rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <span className="text-lg font-bold text-accent-primary">
                                                    #{index + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-primary truncate">
                                                        {market.title}
                                                    </p>
                                                    <p className="text-xs text-secondary mt-1">
                                                        ${((market.volume || 0) / 1000000).toFixed(2)}M volume
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Market Sentiment */}
                            <div className="card">
                                <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-accent-primary" />
                                    Market Sentiment
                                </h3>
                                <div className="text-center">
                                    <div className={`text-5xl font-bold mb-2 ${buyRatio > 50 ? 'text-success' : 'text-danger'}`}>
                                        {buyRatio > 50 ? '📈' : '📉'}
                                    </div>
                                    <p className={`text-xl font-bold ${buyRatio > 50 ? 'text-success' : 'text-danger'}`}>
                                        {buyRatio > 50 ? 'Bullish' : 'Bearish'}
                                    </p>
                                    <p className="text-sm text-secondary mt-2">
                                        Based on {totalTrades} whale trades
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
