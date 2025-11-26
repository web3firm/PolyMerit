'use client';

import { useState, useEffect } from 'react';
import { Wallet, DollarSign, Filter, RefreshCw, Star, ExternalLink, TrendingUp, BarChart3 } from 'lucide-react';
import { Trade, getProfileURL } from '@/lib/polymarket';
import Link from 'next/link';

export default function WhalesPage() {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterSide, setFilterSide] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
    const [minSize, setMinSize] = useState<number>(100);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [trackedWallets, setTrackedWallets] = useState<Set<string>>(new Set());
    const [showOnlyTracked, setShowOnlyTracked] = useState(false);

    // Load tracked wallets from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('trackedWallets');
        if (saved) {
            setTrackedWallets(new Set(JSON.parse(saved)));
        }
    }, []);

    // Save tracked wallets to localStorage
    const toggleTrackWallet = (address: string) => {
        const newTracked = new Set(trackedWallets);
        if (newTracked.has(address)) {
            newTracked.delete(address);
        } else {
            newTracked.add(address);
        }
        setTrackedWallets(newTracked);
        localStorage.setItem('trackedWallets', JSON.stringify(Array.from(newTracked)));
    };

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
                const matchesTracked = !showOnlyTracked || trackedWallets.has(trade.maker_address);
                return matchesSide && matchesSize && matchesTracked;
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
    }, [filterSide, minSize, showOnlyTracked]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        if (!autoRefresh) return;
        
        const interval = setInterval(() => {
            fetchData();
        }, 30000);

        return () => clearInterval(interval);
    }, [autoRefresh, filterSide, minSize, showOnlyTracked]);

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
        <div className="min-h-screen py-8 bg-secondary">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-primary mb-3">
                            Whale Tracker
                        </h1>
                        <p className="text-lg text-secondary">
                            Track large trades and smart money movements in real-time
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="mb-8 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-secondary" />
                            <button
                                onClick={() => setFilterSide('ALL')}
                                className={filterSide === 'ALL' ? 'btn-primary' : 'btn-outline'}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterSide('BUY')}
                                className={filterSide === 'BUY' ? 'btn-success' : 'btn-outline'}
                            >
                                Buys
                            </button>
                            <button
                                onClick={() => setFilterSide('SELL')}
                                className={filterSide === 'SELL' ? 'btn-danger' : 'btn-outline'}
                            >
                                Sells
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm text-secondary">Min Size:</label>
                            <select
                                value={minSize}
                                onChange={(e) => setMinSize(Number(e.target.value))}
                                className="px-3 py-2 rounded-lg border border-border bg-primary text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                            >
                                <option value={0}>All</option>
                                <option value={100}>$100+</option>
                                <option value={500}>$500+</option>
                                <option value={1000}>$1,000+</option>
                                <option value={5000}>$5,000+</option>
                            </select>
                        </div>

                        <button
                            onClick={() => setShowOnlyTracked(!showOnlyTracked)}
                            className={showOnlyTracked ? 'btn-primary' : 'btn-outline'}
                            title="Show only tracked wallets"
                        >
                            <Star size={18} fill={showOnlyTracked ? "white" : "none"} />
                            Tracked {trackedWallets.size > 0 && `(${trackedWallets.size})`}
                        </button>

                        <div className="ml-auto flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm text-secondary">
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
                        <div className="mb-8 p-4 bg-warning/10 border border-warning/30 rounded-lg text-warning">
                            {error}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="card text-center">
                            <div className="text-3xl font-bold text-accent-primary mb-1">{trades.length}</div>
                            <div className="text-sm text-secondary">Recent Trades</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-3xl font-bold text-success mb-1">
                                {trades.filter(t => t.side === 'BUY').length}
                            </div>
                            <div className="text-sm text-secondary">Buys</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-3xl font-bold text-danger mb-1">
                                {trades.filter(t => t.side === 'SELL').length}
                            </div>
                            <div className="text-sm text-secondary">Sells</div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="card overflow-hidden p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-tertiary border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                                            Wallet
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                                            Market
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                                            Price
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                                            Size
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                                            Time
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                                            Side
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
                                                    <div className="text-secondary">Loading whale activity...</div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : trades.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-secondary">
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
                                                <tr key={trade.id} className="hover:bg-tertiary transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                                                                <Wallet size={18} className="text-accent-primary" />
                                                            </div>
                                                            <Link 
                                                                href={`/wallet/${trade.maker_address}`}
                                                                className="font-mono text-sm font-medium text-primary hover:text-accent-primary transition-colors"
                                                            >
                                                                {shortAddress}
                                                            </Link>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="max-w-xs">
                                                            <div className="font-medium text-primary truncate text-sm">
                                                                {trade.market || trade.asset_id}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-primary">
                                                            ${price.toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1 text-primary font-semibold">
                                                            <DollarSign size={14} />
                                                            {value.toFixed(0)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-secondary">
                                                            {formatTime(trade.timestamp)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trade.side === 'BUY'
                                                            ? 'bg-success/10 text-success'
                                                            : 'bg-danger/10 text-danger'
                                                            }`}>
                                                            {trade.side}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                href={`/wallet/${trade.maker_address}`}
                                                                className="p-2 hover:bg-tertiary rounded-lg transition-colors"
                                                                title="View wallet analytics"
                                                            >
                                                                <BarChart3 size={18} className="text-accent-primary" />
                                                            </Link>
                                                            <button
                                                                onClick={() => toggleTrackWallet(trade.maker_address)}
                                                                className="p-2 hover:bg-tertiary rounded-lg transition-colors"
                                                                title={trackedWallets.has(trade.maker_address) ? "Untrack wallet" : "Track wallet"}
                                                            >
                                                                <Star
                                                                    size={18}
                                                                    className={trackedWallets.has(trade.maker_address) ? 'text-warning fill-warning' : 'text-secondary'}
                                                                />
                                                            </button>
                                                            <a
                                                                href={getProfileURL(trade.maker_address)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 hover:bg-tertiary rounded-lg transition-colors"
                                                                title="View on Polymarket"
                                                            >
                                                                <ExternalLink size={18} className="text-accent-primary" />
                                                            </a>
                                                        </div>
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
