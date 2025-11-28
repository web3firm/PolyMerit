'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RealTrade, getPolymarketURL } from '@/lib/polymarket';

export default function WhalesPage() {
    const [trades, setTrades] = useState<RealTrade[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [minSize, setMinSize] = useState<number>(100);
    const [sideFilter, setSideFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');

    useEffect(() => {
        async function fetchTrades() {
            try {
                setLoading(true);
                const response = await fetch('/api/whales?limit=100');
                if (!response.ok) throw new Error('Failed to fetch trades');
                const data = await response.json();
                setTrades(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load trades');
            } finally {
                setLoading(false);
            }
        }

        fetchTrades();
        // Refresh every 30 seconds
        const interval = setInterval(fetchTrades, 30000);
        return () => clearInterval(interval);
    }, []);

    const filteredTrades = trades.filter(trade => {
        if (trade.size < minSize) return false;
        if (sideFilter !== 'ALL' && trade.side !== sideFilter) return false;
        return true;
    });

    const formatTime = (timestamp: number) => {
        // Polymarket uses Unix timestamp in seconds
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    };

    const formatSize = (size: number) => {
        if (size >= 1000000) return `$${(size / 1000000).toFixed(2)}M`;
        if (size >= 1000) return `$${(size / 1000).toFixed(1)}K`;
        return `$${size.toFixed(0)}`;
    };

    const getTraderName = (trade: RealTrade) => {
        return trade.name || trade.pseudonym || `${trade.proxyWallet.slice(0, 6)}...${trade.proxyWallet.slice(-4)}`;
    };

    const stats = {
        totalVolume: trades.reduce((sum, t) => sum + t.size, 0),
        totalTrades: trades.length,
        buyVolume: trades.filter(t => t.side === 'BUY').reduce((sum, t) => sum + t.size, 0),
        sellVolume: trades.filter(t => t.side === 'SELL').reduce((sum, t) => sum + t.size, 0),
        avgSize: trades.length > 0 ? trades.reduce((sum, t) => sum + t.size, 0) / trades.length : 0,
        largestTrade: trades.length > 0 ? Math.max(...trades.map(t => t.size)) : 0,
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        🐋 Whale Tracker
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Real-time trades from Polymarket&apos;s most active traders
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Volume</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatSize(stats.totalVolume)}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Trades</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats.totalTrades}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Buy / Sell</p>
                        <p className="text-2xl font-bold">
                            <span className="text-emerald-500">{formatSize(stats.buyVolume)}</span>
                            <span className="text-gray-400 mx-1">/</span>
                            <span className="text-red-500">{formatSize(stats.sellVolume)}</span>
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Largest Trade</p>
                        <p className="text-2xl font-bold text-purple-500">
                            {formatSize(stats.largestTrade)}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 dark:text-gray-400">Min Size:</label>
                        <select
                            value={minSize}
                            onChange={(e) => setMinSize(Number(e.target.value))}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm"
                        >
                            <option value={0}>All</option>
                            <option value={100}>$100+</option>
                            <option value={500}>$500+</option>
                            <option value={1000}>$1K+</option>
                            <option value={5000}>$5K+</option>
                            <option value={10000}>$10K+</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 dark:text-gray-400">Side:</label>
                        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            {(['ALL', 'BUY', 'SELL'] as const).map((side) => (
                                <button
                                    key={side}
                                    onClick={() => setSideFilter(side)}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                                        sideFilter === side
                                            ? side === 'BUY'
                                                ? 'bg-emerald-500 text-white'
                                                : side === 'SELL'
                                                ? 'bg-red-500 text-white'
                                                : 'bg-blue-500 text-white'
                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {side}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                        Showing {filteredTrades.length} of {trades.length} trades
                    </div>
                </div>

                {/* Trades List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-500 dark:text-gray-400">Loading real trades...</p>
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center">
                            <p className="text-red-500 mb-2">❌ {error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="text-blue-500 hover:underline"
                            >
                                Try again
                            </button>
                        </div>
                    ) : filteredTrades.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            No trades match your filters
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredTrades.map((trade, index) => (
                                <div
                                    key={`${trade.transactionHash}-${index}`}
                                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Trader Avatar */}
                                        <Link 
                                            href={`/wallet/${trade.proxyWallet}`}
                                            className="flex-shrink-0"
                                        >
                                            {trade.profileImage || trade.profileImageOptimized ? (
                                                <Image
                                                    src={trade.profileImageOptimized || trade.profileImage || ''}
                                                    alt={getTraderName(trade)}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                                    {getTraderName(trade).slice(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                        </Link>

                                        {/* Trade Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Link 
                                                    href={`/wallet/${trade.proxyWallet}`}
                                                    className="font-semibold text-gray-900 dark:text-white hover:text-blue-500 transition-colors"
                                                >
                                                    {getTraderName(trade)}
                                                </Link>
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                    trade.side === 'BUY'
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                    {trade.side}
                                                </span>
                                                <span className="text-gray-400 text-sm">
                                                    {formatTime(trade.timestamp)}
                                                </span>
                                            </div>
                                            
                                            <Link
                                                href={getPolymarketURL(`/event/${trade.eventSlug}`)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors line-clamp-1"
                                            >
                                                {trade.title}
                                            </Link>

                                            <div className="flex items-center gap-4 mt-2 text-sm">
                                                <span className={`font-bold ${
                                                    trade.outcome?.toLowerCase() === 'yes' ? 'text-emerald-500' : 
                                                    trade.outcome?.toLowerCase() === 'no' ? 'text-red-500' : 
                                                    'text-gray-600 dark:text-gray-400'
                                                }`}>
                                                    {trade.outcome}
                                                </span>
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    @ {(trade.price * 100).toFixed(1)}¢
                                                </span>
                                            </div>
                                        </div>

                                        {/* Trade Value */}
                                        <div className="text-right">
                                            <p className={`text-lg font-bold ${
                                                trade.side === 'BUY' ? 'text-emerald-500' : 'text-red-500'
                                            }`}>
                                                {formatSize(trade.size)}
                                            </p>
                                            <a
                                                href={`https://polygonscan.com/tx/${trade.transactionHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-500 hover:underline"
                                            >
                                                View TX ↗
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Live indicator */}
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Live data from Polymarket • Auto-refreshes every 30s
                </div>
            </div>
        </div>
    );
}
