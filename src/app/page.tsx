'use client';

import Link from 'next/link';
import { BarChart2, TrendingUp, Shield, Zap, Brain, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Market } from '@/lib/polymarket';
import MarketCard from '@/components/MarketCard';
import LiveFeed from '@/components/LiveFeed';
import ProfitableTraders from '@/components/ProfitableTraders';
import AIInsights from '@/components/AIInsights';

export default function Home() {
  const [stats, setStats] = useState({ volume: '...', markets: '...', traders: '...' });
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/events?limit=6&closed=false');
        const events = await res.json();
        if (events?.length) {
          const allMarkets = events.flatMap((e: any) => e.markets || []).filter((m: any) => m);
          const totalVol = events.reduce((s: number, e: any) => s + parseFloat(e.volume || '0'), 0);
          setStats({
            volume: `$${(totalVol / 1000000).toFixed(0)}M`,
            markets: allMarkets.length.toString(),
            traders: '10K+'
          });
          setMarkets(allMarkets.slice(0, 6));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-primary border-b border-primary">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-accent">Live Data • Real-time Updates</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary leading-tight">
              Professional Analytics<br />for Polymarket Traders
            </h1>
            <p className="text-lg md:text-xl text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
              Track whale movements, analyze market sentiment, and discover opportunities with AI-powered insights
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/scanner" className="btn-primary">
                <BarChart2 size={20} />
                Explore Markets
              </Link>
              <Link href="/whales" className="btn-outline">
                <TrendingUp size={20} />
                Track Whales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-gradient-to-b from-primary to-secondary border-b border-primary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Total Volume', value: stats.volume, icon: '💰', color: 'from-purple-500 to-purple-600' },
              { label: 'Active Markets', value: stats.markets, icon: '📊', color: 'from-blue-500 to-blue-600' },
              { label: 'Traders Tracked', value: stats.traders, icon: '👥', color: 'from-green-500 to-green-600' }
            ].map((s, i) => (
              <div key={i} className="bg-primary rounded-xl p-6 shadow-sm border border-primary hover:shadow-md transition-shadow">
                <div className="text-2xl mb-3">{s.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-accent mb-1">{s.value}</div>
                <div className="text-xs md:text-sm text-secondary font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Markets */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary">Trending Markets</h2>
            <p className="text-secondary">Live markets with highest volume and activity</p>
          </div>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card h-48 animate-pulse">
                  <div className="h-4 rounded w-3/4 mb-4" style={{ background: 'rgb(var(--bg-tertiary))' }}></div>
                  <div className="h-3 rounded w-1/2" style={{ background: 'rgb(var(--bg-tertiary))' }}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {markets.map(m => {
                let yp = 0.5, np = 0.5;
                try {
                  const prices = typeof m.outcomePrices === 'string' ? JSON.parse(m.outcomePrices) : m.outcomePrices;
                  if (Array.isArray(prices) && prices.length >= 2) {
                    yp = parseFloat(prices[0]) || 0.5;
                    np = parseFloat(prices[1]) || 0.5;
                  }
                } catch {}
                return (
                  <MarketCard
                    key={m.id}
                    title={m.question}
                    volume={`$${parseInt(m.volume || '0').toLocaleString()}`}
                    yesPrice={yp}
                    noPrice={np}
                    isTrending
                    slug={m.slug}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Live Feed & Top Traders */}
      <section className="py-12 md:py-16 bg-primary border-y border-primary">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary">Live Market Intelligence</h2>
            <p className="text-secondary">Real-time whale trades and top performer analytics</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            <div className="card">
              <LiveFeed />
            </div>
            <div className="card">
              <ProfitableTraders />
            </div>
          </div>
        </div>
      </section>

      {/* AI Insights Preview */}
      {!loading && markets.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-accent/10 rounded-full">
                <Brain size={20} className="text-accent" />
                <span className="text-sm font-semibold text-accent">AI-Powered</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">Smart Market Analysis</h2>
              <p className="text-secondary max-w-2xl mx-auto">
                Advanced sentiment analysis, price predictions, and anomaly detection powered by machine learning
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {markets.slice(0, 2).map(market => (
                <AIInsights key={market.id} market={market} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-12 md:py-16 bg-primary border-t border-primary">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary">Why Choose PolyMerit?</h2>
            <p className="text-secondary">Professional tools for serious traders</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: 'AI Analytics', desc: 'Advanced sentiment & predictions', color: 'purple' },
              { icon: Activity, title: 'Real-Time Feed', desc: 'Live updates every 3 seconds', color: 'blue' },
              { icon: BarChart2, title: 'Whale Tracking', desc: 'Monitor smart money movements', color: 'green' },
              { icon: Zap, title: 'Ultra Fast', desc: 'Professional-grade insights', color: 'orange' }
            ].map((f, i) => (
              <div key={i} className="bg-secondary rounded-xl p-6 border border-primary hover:border-accent/50 transition-all hover:shadow-md group">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: 'rgba(var(--accent-primary), 0.1)' }}>
                  <f.icon size={24} className="text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-primary">{f.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
