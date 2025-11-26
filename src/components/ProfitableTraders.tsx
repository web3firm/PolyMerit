'use client';

import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Wallet, DollarSign, Award, RefreshCw } from 'lucide-react';
import { Trade } from '@/lib/polymarket';
import { analyzeTraderPerformance } from '@/lib/ai-insights';

interface TraderStats {
  address: string;
  totalTrades: number;
  buyTrades: number;
  sellTrades: number;
  totalVolume: number;
  avgTradeSize: number;
  recentActivity: number;
  rank?: number;
}

export default function ProfitableTraders() {
  const [traders, setTraders] = useState<TraderStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d'>('24h');

  const fetchTopTraders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/whales?limit=200');
      const trades: Trade[] = await response.json();

      if (trades && trades.length > 0) {
        const topTraders = analyzeTraderPerformance(trades);
        const rankedTraders = topTraders.map((t: any, idx: number) => ({
          ...t,
          rank: idx + 1
        }));
        setTraders(rankedTraders);
      }
    } catch (error) {
      console.error('Failed to fetch top traders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopTraders();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTopTraders, 30000);
    return () => clearInterval(interval);
  }, [timeframe]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number): string => {
    if (rank === 1) return 'rgb(202, 138, 4)';
    if (rank === 2) return 'rgb(156, 163, 175)';
    if (rank === 3) return 'rgb(234, 88, 12)';
    return 'rgb(var(--text-primary))';
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(202, 138, 4, 0.1)' }}>
            <Trophy size={24} style={{ color: 'rgb(202, 138, 4)' }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">Top Traders</h3>
            <p className="text-sm text-secondary">Smart money leaderboard</p>
          </div>
        </div>
        <button
          onClick={fetchTopTraders}
          disabled={loading}
          className="btn-ghost px-3 py-2"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2 mb-6">
        {(['1h', '24h', '7d'] as const).map(tf => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={timeframe === tf ? 'btn-primary' : 'btn-outline'}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(147, 51, 234, 0.05))' }}>
          <div className="text-2xl font-bold mb-1 text-accent">
            {traders.length}
          </div>
          <div className="text-xs text-secondary">Active Whales</div>
        </div>
        <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))' }}>
          <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(22, 163, 74)' }}>
            ${traders.reduce((sum, t) => sum + t.totalVolume, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-secondary">Total Volume</div>
        </div>
        <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.05))' }}>
          <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(234, 88, 12)' }}>
            {traders.reduce((sum, t) => sum + t.totalTrades, 0)}
          </div>
          <div className="text-xs text-secondary">Total Trades</div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin" style={{ scrollbarColor: 'rgb(var(--text-secondary)) transparent' }}>
        {loading ? (
          [...Array(10)].map((_, idx) => (
            <div key={idx} className="p-4 bg-primary rounded-lg border-card animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-secondary rounded w-32 mb-2"></div>
                  <div className="h-3 bg-secondary rounded w-24"></div>
                </div>
              </div>
            </div>
          ))
        ) : traders.length === 0 ? (
          <div className="text-center py-12 text-secondary">
            <Trophy size={48} className="mx-auto mb-3 opacity-50" />
            <p>No trader data available</p>
          </div>
        ) : (
          traders.map((trader) => {
            const shortAddr = `${trader.address.slice(0, 6)}...${trader.address.slice(-4)}`;
            const winRate = trader.totalTrades > 0 ? (trader.buyTrades / trader.totalTrades) * 100 : 0;
            const isTopThree = trader.rank && trader.rank <= 3;

            return (
              <div
                key={trader.address}
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  isTopThree
                    ? 'border-card'
                    : 'bg-primary border-card hover:border-accent/50'
                }`}
                style={isTopThree ? { background: 'linear-gradient(90deg, rgba(202, 138, 4, 0.1), rgba(234, 88, 12, 0.1))' } : {}}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="text-2xl font-bold min-w-[40px]" style={{ color: getRankColor(trader.rank || 0) }}>
                    {getRankIcon(trader.rank || 0)}
                  </div>

                  {/* Trader Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center\" style={{ backgroundColor: 'rgba(147, 51, 234, 0.1)' }}>
                        <Wallet size={16} className="text-accent" />
                      </div>
                      <span className="font-mono text-sm font-semibold text-primary">
                        {shortAddr}
                      </span>
                      {isTopThree && (
                        <Award size={16} style={{ color: 'rgb(202, 138, 4)' }} />
                      )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-secondary mb-1">Volume</div>
                        <div className="text-sm font-bold text-primary flex items-center gap-1">
                          <DollarSign size={12} />
                          {(trader.totalVolume / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-secondary mb-1">Trades</div>
                        <div className="text-sm font-bold text-primary">
                          {trader.totalTrades}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-secondary mb-1">Avg Size</div>
                        <div className="text-sm font-bold text-primary">
                          ${(trader.avgTradeSize / 1000).toFixed(1)}K
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-secondary mb-1">Buy %</div>
                        <div className="text-sm font-bold" style={{
                          color: winRate > 60 ? 'rgb(22, 163, 74)' : winRate < 40 ? 'rgb(220, 38, 38)' : 'rgb(var(--text-secondary))'
                        }}>
                          {winRate.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Indicator */}
                  {trader.recentActivity > 0 && (
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="text-xs text-secondary">
                        Active
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
