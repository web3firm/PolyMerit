'use client';

import { useState, useEffect, useRef } from 'react';
import { TrendingUp, Activity, Flame, DollarSign, ExternalLink } from 'lucide-react';
import { Trade, Market, Event } from '@/lib/polymarket';
import Link from 'next/link';

interface FeedItem {
  type: 'whale' | 'hot' | 'new';
  timestamp: number;
  data: any;
  id: string;
}

export default function LiveFeed() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const feedRef = useRef<HTMLDivElement>(null);

  const fetchLiveData = async () => {
    try {
      // Fetch whale trades
      const whaleRes = await fetch('/api/whales?limit=10');
      const whales: Trade[] = await whaleRes.json();

      // Fetch hot markets (high volume)
      const marketsRes = await fetch('/api/events?limit=10&closed=false');
      const events: Event[] = await marketsRes.json();

      const newFeed: FeedItem[] = [];

      // Add whale trades
      whales.forEach(whale => {
        newFeed.push({
          type: 'whale',
          timestamp: whale.timestamp * 1000,
          data: whale,
          id: `whale-${whale.id}`
        });
      });

      // Add hot markets (high volume recent)
      events.forEach(event => {
        if (event.markets && event.markets.length > 0) {
          const topMarket = event.markets[0];
          const volume = parseFloat(event.volume?.toString() || '0');
          if (volume > 100000) { // Only show markets with >$100k volume
            newFeed.push({
              type: 'hot',
              timestamp: Date.now(),
              data: { event, market: topMarket },
              id: `hot-${event.id}`
            });
          }
        }
      });

      // Sort by timestamp (most recent first)
      newFeed.sort((a, b) => b.timestamp - a.timestamp);

      setFeed(newFeed.slice(0, 20)); // Keep only 20 most recent
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch live data:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLiveData();

    // Auto-refresh every 3 seconds (like PolyInsider)
    if (isLive) {
      const interval = setInterval(fetchLiveData, 3000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const renderWhaleItem = (item: FeedItem) => {
    const trade = item.data as Trade;
    const size = parseFloat(trade.size || '0');
    const price = parseFloat(trade.price || '0');
    const value = size * price;
    const shortAddr = `${trade.maker_address.slice(0, 6)}...${trade.maker_address.slice(-4)}`;

    return (
      <div className="flex items-center gap-4 p-4 bg-primary rounded-lg border-card hover:border-accent/50 transition-all">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          trade.side === 'BUY' 
            ? 'bg-green-50' 
            : 'bg-red-50'
        }`} style={{
          backgroundColor: trade.side === 'BUY' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'
        }}>
          <TrendingUp size={20} style={{
            color: trade.side === 'BUY' ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)'
          }} className={trade.side === 'BUY' ? '' : 'rotate-180'} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-xs font-bold`} style={{
              backgroundColor: trade.side === 'BUY' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: trade.side === 'BUY' ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)'
            }}>
              {trade.side}
            </span>
            <span className="font-mono text-sm text-secondary">
              {shortAddr}
            </span>
          </div>
          <p className="text-sm text-primary truncate">
            {trade.market}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm font-bold text-primary">
              ${value.toFixed(0)}
            </span>
            <span className="text-xs text-secondary">
              @ ${price.toFixed(2)}
            </span>
            <span className="text-xs text-secondary ml-auto">
              {formatTime(item.timestamp)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderHotItem = (item: FeedItem) => {
    const { event, market } = item.data;
    const volume = parseFloat(event.volume?.toString() || '0');
    
    let yesPrice = 0.5;
    try {
      const prices = typeof market.outcomePrices === 'string' 
        ? JSON.parse(market.outcomePrices) 
        : market.outcomePrices;
      if (Array.isArray(prices) && prices.length > 0) {
        yesPrice = parseFloat(prices[0]) || 0.5;
      }
    } catch {}

    return (
      <div className="flex items-center gap-4 p-4 bg-primary rounded-lg border-card hover:border-accent/50 transition-all">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}>
          <Flame size={20} style={{ color: 'rgb(234, 88, 12)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', color: 'rgb(234, 88, 12)' }}>
              HOT
            </span>
            <span className="text-xs text-secondary">
              ${(volume / 1000000).toFixed(1)}M volume
            </span>
          </div>
          <Link 
            href={`https://polymarket.com/event/${event.slug}`}
            target="_blank"
            className="text-sm text-primary truncate hover:text-accent flex items-center gap-1"
          >
            {market.question}
            <ExternalLink size={12} />
          </Link>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1">
              <span className="text-xs text-secondary">YES</span>
              <span className="text-sm font-bold" style={{ color: 'rgb(22, 163, 74)' }}>
                {(yesPrice * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-secondary">NO</span>
              <span className="text-sm font-bold" style={{ color: 'rgb(220, 38, 38)' }}>
                {((1 - yesPrice) * 100).toFixed(0)}%
              </span>
            </div>
            <span className="text-xs text-secondary ml-auto">
              {formatTime(item.timestamp)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(var(--accent-primary), 0.1)' }}>
            <Activity size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              Live Feed
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            </h3>
            <p className="text-xs text-secondary">Real-time whale activity</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-secondary hidden sm:inline">
            {formatTime(lastUpdate.getTime())}
          </span>
          <button
            onClick={() => setIsLive(!isLive)}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all border"
            style={{
              backgroundColor: isLive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(156, 163, 175, 0.1)',
              color: isLive ? 'rgb(22, 163, 74)' : 'rgb(107, 114, 128)',
              borderColor: isLive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(156, 163, 175, 0.2)'
            }}
          >
            {isLive ? '🔴 LIVE' : '⏸️ PAUSED'}
          </button>
        </div>
      </div>

      {/* Feed */}
      <div 
        ref={feedRef}
        className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin"
        style={{ scrollbarColor: 'rgb(var(--text-secondary)) transparent' }}
      >
        {feed.length === 0 ? (
          <div className="text-center py-12 text-secondary">
            <Activity size={48} className="mx-auto mb-3 opacity-50" />
            <p>Waiting for live updates...</p>
          </div>
        ) : (
          feed.map(item => (
            <div key={item.id}>
              {item.type === 'whale' && renderWhaleItem(item)}
              {item.type === 'hot' && renderHotItem(item)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
