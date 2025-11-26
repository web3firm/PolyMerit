'use client';

import { useState, useEffect } from 'react';
import { Wallet, DollarSign, Filter, RefreshCw } from 'lucide-react';
import { Trade } from '@/lib/polymarket';

export default function WhalesPage() {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterSide, setFilterSide] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
    const [minSize, setMinSize] = useState<number>(100);
    const [autoRefresh, setAutoRefresh] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/whales?limit=50');
            const data: Trade[] = await response.json();

            if (!data || data.length === 0) {
                setError('No whale activity data available at the moment.');
                setTrades([]);
                return;
            }

            // Filter trades by minimum size and side
            const filtered = data.filter(trade => {
                const size = parseFloat(trade.size || '0');
                const matchesSide = filterSide === 'ALL' || trade.side === filterSide;
                const matchesSize = size >= minSize;
                return matchesSide && matchesSize;
            });

            setTrades(filtered);
        } catch (error) {
            console.error('Failed to fetch whale activity', error);
            setError('Failed to load whale activity. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filterSide, minSize]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        if (!autoRefresh) return;
        
        const interval = setInterval(() => {
            fetchData();
        }, 30000);

        return () => clearInterval(interval);
    }, [autoRefresh, filterSide, minSize]);

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            Whale Tracker
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Track large trades and smart money movements in real-time
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="mb-8 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-gray-500" />
                            <button
                                onClick={() => setFilterSide('ALL')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterSide === 'ALL'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterSide('BUY')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterSide === 'BUY'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300'
                                    }`}
                            >
                                Buys
                            </button>
                            <button
                                onClick={() => setFilterSide('SELL')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterSide === 'SELL'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
                                    }`}
                            >
                                Sells
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Min Size:</label>
                            <select
                                value={minSize}
                                onChange={(e) => setMinSize(Number(e.target.value))}
                                className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value={0}>All</option>
                                <option value={100}>$100+</option>
                                <option value={500}>$500+</option>
                                <option value={1000}>$1,000+</option>
                                <option value={5000}>$5,000+</option>
                            </select>
                        </div>

                        <div className="ml-auto flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={autoRefresh}
                                    onChange={(e) => setAutoRefresh(e.target.checked)}
                                    className="rounded"
                                />
                                Auto-refresh
                            </label>
                            <button
                                onClick={fetchData}
                                disabled={loading}
                                className="btn-ghost px-3 py-2"
                            >
                                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && !loading && (
                        <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-800 dark:text-yellow-300">
                            {error}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="card text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-1">{trades.length}</div>
                            <div className="text-sm text-gray-600">Recent Trades</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-3xl font-bold text-green-600 mb-1">
                                {trades.filter(t => t.side === 'BUY').length}
                            </div>
                            <div className="text-sm text-gray-600">Buys</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-3xl font-bold text-red-600 mb-1">
                                {trades.filter(t => t.side === 'SELL').length}
                            </div>
                            <div className="text-sm text-gray-600">Sells</div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="card overflow-hidden p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Wallet
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Market
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Price
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Size
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Time
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                                    <div className="text-gray-500 dark:text-gray-400">Loading whale activity...</div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : trades.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                                {error || 'No trades found matching your filters.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        trades.map((trade) => {
                                            const shortAddress = trade.maker_address.length > 10
                                                ? `${trade.maker_address.slice(0, 6)}...${trade.maker_address.slice(-4)}`
                                                : trade.maker_address;
                                            
                                            const size = parseFloat(trade.size || '0');
                                            const price = parseFloat(trade.price || '0');
                                            const value = size * price;

                                            return (
                                                <tr key={trade.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                                                <Wallet size={18} className="text-purple-600 dark:text-purple-400" />
                                                            </div>
                                                            <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {shortAddress}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="max-w-xs">
                                                            <div className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm">
                                                                {trade.market || trade.asset_id}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-900 dark:text-gray-100">
                                                            ${price.toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1 text-gray-900 dark:text-gray-100 font-semibold">
                                                            <DollarSign size={14} />
                                                            {value.toFixed(0)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                            {formatTime(trade.timestamp)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trade.side === 'BUY'
                                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                                            }`}>
                                                            {trade.side}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
