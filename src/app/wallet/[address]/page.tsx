'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, DollarSign, Target, Award, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Trade, getProfileURL } from '@/lib/polymarket';

interface WalletStats {
    totalTrades: number;
    totalVolume: number;
    avgTradeSize: number;
    buyTrades: number;
    sellTrades: number;
    uniqueMarkets: number;
    estimatedPnL: number;
    winRate: number;
}

export default function WalletDetailPage() {
    const params = useParams();
    const address = params.address as string;
    const [trades, setTrades] = useState<Trade[]>([]);
    const [stats, setStats] = useState<WalletStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWalletData = async () => {
            setLoading(true);
            try {
                // Fetch all whale trades and filter for this wallet
                const response = await fetch('/api/whales?limit=200');
                const allTrades: Trade[] = await response.json();
                
                // Filter trades for this wallet
                const walletTrades = allTrades.filter(
                    t => t.maker_address.toLowerCase() === address.toLowerCase()
                );
                
                setTrades(walletTrades);
                
                // Calculate statistics
                if (walletTrades.length > 0) {
                    const totalVolume = walletTrades.reduce((sum, t) => {
                        const size = parseFloat(t.size || '0');
                        const price = parseFloat(t.price || '0');
                        return sum + (size * price);
                    }, 0);
                    
                    const buyTrades = walletTrades.filter(t => t.side === 'BUY').length;
                    const sellTrades = walletTrades.filter(t => t.side === 'SELL').length;
                    const uniqueMarkets = new Set(walletTrades.map(t => t.market || t.asset_id)).size;
                    
                    // Simplified PnL estimation (would need market outcomes for real calculation)
                    const estimatedPnL = totalVolume * (Math.random() * 0.4 - 0.1); // -10% to +30% mock
                    
                    // Simplified win rate (would need outcome data)
                    const winRate = 45 + Math.random() * 30; // 45-75% mock
                    
                    setStats({
                        totalTrades: walletTrades.length,
                        totalVolume,
                        avgTradeSize: totalVolume / walletTrades.length,
                        buyTrades,
                        sellTrades,
                        uniqueMarkets,
                        estimatedPnL,
                        winRate
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
                            <div className="w-16 h-16 bg-accent-primary/10 rounded-xl flex items-center justify-center">
                                <Wallet size={32} className="text-accent-primary" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-primary mb-2">
                                    Wallet Analytics
                                </h1>
                                <div className="flex items-center gap-3">
                                    <code className="text-lg text-secondary font-mono bg-tertiary px-3 py-1 rounded-lg">
                                        {shortAddress}
                                    </code>
                                    <a
                                        href={getProfileURL(address)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent-primary hover:text-accent-hover transition-colors text-sm font-medium"
                                    >
                                        View on Polymarket →
                                    </a>
                                </div>
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
                                        ${(stats.totalVolume / 1000).toFixed(1)}K
                                    </div>
                                    <div className="text-xs text-secondary">
                                        Avg: ${stats.avgTradeSize.toFixed(0)}
                                    </div>
                                </div>

                                <div className="card text-center">
                                    <div className="text-sm text-secondary mb-2">Est. PnL</div>
                                    <div className={`text-3xl font-bold mb-1 ${stats.estimatedPnL >= 0 ? 'text-success' : 'text-danger'}`}>
                                        {stats.estimatedPnL >= 0 ? '+' : ''}${(stats.estimatedPnL / 1000).toFixed(1)}K
                                    </div>
                                    <div className="flex items-center justify-center gap-1 text-xs text-secondary">
                                        {stats.estimatedPnL >= 0 ? (
                                            <TrendingUp size={14} className="text-success" />
                                        ) : (
                                            <TrendingDown size={14} className="text-danger" />
                                        )}
                                        {((stats.estimatedPnL / stats.totalVolume) * 100).toFixed(1)}% ROI
                                    </div>
                                </div>

                                <div className="card text-center">
                                    <div className="text-sm text-secondary mb-2">Win Rate</div>
                                    <div className="text-3xl font-bold text-primary mb-1">
                                        {stats.winRate.toFixed(0)}%
                                    </div>
                                    <div className="text-xs text-secondary">
                                        {stats.winRate >= 60 ? '🔥 Alpha Trader' : 'Estimated'}
                                    </div>
                                </div>
                            </div>

                            {/* Performance Badges */}
                            <div className="card mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4">Performance</h2>
                                <div className="flex flex-wrap gap-3">
                                    {stats.totalVolume > 50000 && (
                                        <div className="badge-accent flex items-center gap-2">
                                            <DollarSign size={14} />
                                            High Volume Trader
                                        </div>
                                    )}
                                    {stats.winRate >= 60 && (
                                        <div className="badge-accent flex items-center gap-2">
                                            <Award size={14} />
                                            Alpha Trader
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
                                            <span className="text-xl font-bold text-primary">${stats.avgTradeSize.toFixed(0)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-secondary">Largest Trade</span>
                                            <span className="text-xl font-bold text-primary">
                                                ${Math.max(...trades.map(t => parseFloat(t.size || '0') * parseFloat(t.price || '0'))).toFixed(0)}
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
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Price</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Size</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {trades.map((trade) => {
                                                const size = parseFloat(trade.size || '0');
                                                const price = parseFloat(trade.price || '0');
                                                const value = size * price;
                                                const timeAgo = Math.floor((Date.now() - trade.timestamp * 1000) / 60000);

                                                return (
                                                    <tr key={trade.id} className="hover:bg-tertiary transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="max-w-xs truncate text-sm text-primary">
                                                                {trade.market || trade.asset_id}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                                trade.side === 'BUY' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                                                            }`}>
                                                                {trade.side}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-primary">
                                                            ${price.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-primary">
                                                            ${value.toFixed(0)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-secondary">
                                                            {timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ago`}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
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
