'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, DollarSign, Target, Award, BarChart3, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { RealTrade, getProfileURL, getUserTrades, getPolymarketURL } from '@/lib/polymarket';

interface WalletStats {
    totalTrades: number;
    totalVolume: number;
    avgTradeSize: number;
    buyTrades: number;
    sellTrades: number;
    uniqueMarkets: number;
    buyVolume: number;
    sellVolume: number;
}

interface TraderProfile {
    name: string;
    pseudonym: string;
    bio?: string;
    profileImage?: string;
}

export default function WalletDetailPage() {
    const params = useParams();
    const address = params.address as string;
    const [trades, setTrades] = useState<RealTrade[]>([]);
    const [stats, setStats] = useState<WalletStats | null>(null);
    const [profile, setProfile] = useState<TraderProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWalletData = async () => {
            setLoading(true);
            try {
                // Fetch trades directly for this wallet using the Data API
                const response = await fetch(`https://data-api.polymarket.com/trades?user=${address}&limit=100`);
                const walletTrades: RealTrade[] = response.ok ? await response.json() : [];
                
                setTrades(walletTrades);
                
                // Extract profile from first trade
                if (walletTrades.length > 0) {
                    const firstTrade = walletTrades[0];
                    setProfile({
                        name: firstTrade.name,
                        pseudonym: firstTrade.pseudonym,
                        bio: firstTrade.bio,
                        profileImage: firstTrade.profileImageOptimized || firstTrade.profileImage
                    });
                }
                
                // Calculate statistics from real data
                if (walletTrades.length > 0) {
                    const buyTrades = walletTrades.filter(t => t.side === 'BUY');
                    const sellTrades = walletTrades.filter(t => t.side === 'SELL');
                    const totalVolume = walletTrades.reduce((sum, t) => sum + t.size, 0);
                    const buyVolume = buyTrades.reduce((sum, t) => sum + t.size, 0);
                    const sellVolume = sellTrades.reduce((sum, t) => sum + t.size, 0);
                    const uniqueMarkets = new Set(walletTrades.map(t => t.conditionId)).size;
                    
                    setStats({
                        totalTrades: walletTrades.length,
                        totalVolume,
                        avgTradeSize: totalVolume / walletTrades.length,
                        buyTrades: buyTrades.length,
                        sellTrades: sellTrades.length,
                        uniqueMarkets,
                        buyVolume,
                        sellVolume
                    });
                }
            } catch (error) {
                console.error('Failed to fetch wallet data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (address) {
            fetchWalletData();
        }
    }, [address]);

    const shortAddress = address.length > 10
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : address;
    
    const displayName = profile?.name || profile?.pseudonym || shortAddress;

    const formatSize = (size: number) => {
        if (size >= 1000000) return `$${(size / 1000000).toFixed(2)}M`;
        if (size >= 1000) return `$${(size / 1000).toFixed(1)}K`;
        return `$${size.toFixed(0)}`;
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="min-h-screen py-8 bg-secondary">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="animate-pulse space-y-8">
                            <div className="h-8 bg-tertiary rounded w-1/4"></div>
                            <div className="grid grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="h-32 bg-tertiary rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 bg-secondary">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <Link 
                        href="/whales" 
                        className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover mb-6 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Whale Tracker
                    </Link>

                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-3">
                            {profile?.profileImage ? (
                                <Image
                                    src={profile.profileImage}
                                    alt={displayName}
                                    width={64}
                                    height={64}
                                    className="rounded-xl"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">
                                        {displayName.slice(0, 2).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div>
                                <h1 className="text-4xl font-bold text-primary mb-2">
                                    {displayName}
                                </h1>
                                <div className="flex items-center gap-3">
                                    <code className="text-lg text-secondary font-mono bg-tertiary px-3 py-1 rounded-lg">
                                        {shortAddress}
                                    </code>
                                    <a
                                        href={getProfileURL(address)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent-primary hover:text-accent-hover transition-colors text-sm font-medium flex items-center gap-1"
                                    >
                                        View on Polymarket <ExternalLink size={14} />
                                    </a>
                                </div>
                                {profile?.bio && (
                                    <p className="text-secondary mt-2 max-w-xl">{profile.bio}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {!stats ? (
                        <div className="card text-center py-12">
                            <p className="text-secondary text-lg">No trading data available for this wallet</p>
                            <p className="text-secondary text-sm mt-2">This wallet may not have made any large trades recently</p>
                        </div>
                    ) : (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                <div className="card text-center">
                                    <div className="text-sm text-secondary mb-2">Total Trades</div>
                                    <div className="text-3xl font-bold text-accent-primary mb-1">
                                        {stats.totalTrades}
                                    </div>
                                    <div className="text-xs text-secondary">
                                        {stats.buyTrades} buys, {stats.sellTrades} sells
                                    </div>
                                </div>

                                <div className="card text-center">
                                    <div className="text-sm text-secondary mb-2">Total Volume</div>
                                    <div className="text-3xl font-bold text-primary mb-1">
                                        {formatSize(stats.totalVolume)}
                                    </div>
                                    <div className="text-xs text-secondary">
                                        Avg: {formatSize(stats.avgTradeSize)}
                                    </div>
                                </div>

                                <div className="card text-center">
                                    <div className="text-sm text-secondary mb-2">Buy Volume</div>
                                    <div className="text-3xl font-bold text-success mb-1">
                                        {formatSize(stats.buyVolume)}
                                    </div>
                                    <div className="text-xs text-secondary flex items-center justify-center gap-1">
                                        <TrendingUp size={14} className="text-success" />
                                        {((stats.buyVolume / stats.totalVolume) * 100).toFixed(0)}% of total
                                    </div>
                                </div>

                                <div className="card text-center">
                                    <div className="text-sm text-secondary mb-2">Sell Volume</div>
                                    <div className="text-3xl font-bold text-danger mb-1">
                                        {formatSize(stats.sellVolume)}
                                    </div>
                                    <div className="text-xs text-secondary flex items-center justify-center gap-1">
                                        <TrendingDown size={14} className="text-danger" />
                                        {((stats.sellVolume / stats.totalVolume) * 100).toFixed(0)}% of total
                                    </div>
                                </div>
                            </div>

                            {/* Performance Badges */}
                            <div className="card mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4">Trader Badges</h2>
                                <div className="flex flex-wrap gap-3">
                                    {stats.totalVolume > 50000 && (
                                        <div className="badge-accent flex items-center gap-2">
                                            <DollarSign size={14} />
                                            High Volume Trader
                                        </div>
                                    )}
                                    {stats.buyVolume > stats.sellVolume * 1.5 && (
                                        <div className="badge-accent flex items-center gap-2">
                                            <TrendingUp size={14} />
                                            Bull
                                        </div>
                                    )}
                                    {stats.sellVolume > stats.buyVolume * 1.5 && (
                                        <div className="badge-accent flex items-center gap-2">
                                            <TrendingDown size={14} />
                                            Bear
                                        </div>
                                    )}
                                    {stats.uniqueMarkets >= 10 && (
                                        <div className="badge-accent flex items-center gap-2">
                                            <Target size={14} />
                                            Diversified Portfolio
                                        </div>
                                    )}
                                    {stats.totalTrades >= 20 && (
                                        <div className="badge-accent flex items-center gap-2">
                                            <BarChart3 size={14} />
                                            Active Trader
                                        </div>
                                    )}
                                    {stats.avgTradeSize > 1000 && (
                                        <div className="badge-accent flex items-center gap-2">
                                            <Award size={14} />
                                            Big Player
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Trade Distribution */}
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="card">
                                    <h3 className="text-lg font-bold text-primary mb-4">Trade Distribution</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-success font-semibold">BUY</span>
                                                <span className="text-secondary">{stats.buyTrades} trades ({((stats.buyTrades / stats.totalTrades) * 100).toFixed(0)}%)</span>
                                            </div>
                                            <div className="h-3 bg-tertiary rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-success rounded-full transition-all"
                                                    style={{ width: `${(stats.buyTrades / stats.totalTrades) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-danger font-semibold">SELL</span>
                                                <span className="text-secondary">{stats.sellTrades} trades ({((stats.sellTrades / stats.totalTrades) * 100).toFixed(0)}%)</span>
                                            </div>
                                            <div className="h-3 bg-tertiary rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-danger rounded-full transition-all"
                                                    style={{ width: `${(stats.sellTrades / stats.totalTrades) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <h3 className="text-lg font-bold text-primary mb-4">Market Activity</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-secondary">Unique Markets</span>
                                            <span className="text-xl font-bold text-accent-primary">{stats.uniqueMarkets}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-secondary">Avg Trade Size</span>
                                            <span className="text-xl font-bold text-primary">{formatSize(stats.avgTradeSize)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-secondary">Largest Trade</span>
                                            <span className="text-xl font-bold text-primary">
                                                {formatSize(Math.max(...trades.map(t => t.size)))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Trades Table */}
                            <div className="card p-0 overflow-hidden">
                                <div className="p-6 border-b border-border">
                                    <h2 className="text-xl font-bold text-primary">Recent Trades</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-tertiary border-b border-border">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Market</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Side</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Outcome</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Price</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Size</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Time</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">TX</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {trades.map((trade, index) => (
                                                <tr key={`${trade.transactionHash}-${index}`} className="hover:bg-tertiary transition-colors">
                                                    <td className="px-6 py-4">
                                                        <Link
                                                            href={getPolymarketURL(`/event/${trade.eventSlug}`)}
                                                            target="_blank"
                                                            className="max-w-xs truncate text-sm text-primary hover:text-accent-primary transition-colors block"
                                                        >
                                                            {trade.title}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                            trade.side === 'BUY' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                                                        }`}>
                                                            {trade.side}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-sm font-medium ${
                                                            trade.outcome?.toLowerCase() === 'yes' ? 'text-success' : 
                                                            trade.outcome?.toLowerCase() === 'no' ? 'text-danger' : 
                                                            'text-primary'
                                                        }`}>
                                                            {trade.outcome}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-primary">
                                                        {(trade.price * 100).toFixed(1)}¢
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-primary">
                                                        {formatSize(trade.size)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-secondary">
                                                        {formatTime(trade.timestamp)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <a
                                                            href={`https://polygonscan.com/tx/${trade.transactionHash}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-accent-primary hover:text-accent-hover text-xs"
                                                        >
                                                            View ↗
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
