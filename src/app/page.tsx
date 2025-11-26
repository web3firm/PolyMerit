'use client';

import Link from 'next/link';
import { BarChart2, Shield, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Market } from '@/lib/polymarket';
import MarketCard from '@/components/MarketCard';
import SkeletonCard from '@/components/SkeletonCard';

export default function Home() {
  const [stats, setStats] = useState({ volume: '...', markets: '...', traders: '...' });
  const [trendingMarkets, setTrendingMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/events?limit=6&closed=false');
        const events = await response.json();
        if (events && Array.isArray(events) && events.length > 0) {
          const allMarkets = events.flatMap((e: any) => e.markets || []).filter((m: any) => m);
          const totalVolume = events.reduce((sum: number, e: any) => sum + parseFloat(e.volume || '0'), 0);
          setStats({
            volume: `$${(totalVolume / 1000000).toFixed(0)}M`,
            markets: allMarkets.length.toString(),
            traders: '10K+',
          });
          setTrendingMarkets(allMarkets.slice(0, 6));
        }
      } catch (error) {
        console.error('Failed to fetch markets:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto mb-20 fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold mb-8">
              <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
              Professional Analytics Platform
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight">
              <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 dark:from-gray-100 dark:via-purple-200 dark:to-indigo-200 bg-clip-text text-transparent">
                Polymarket Intelligence
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto font-medium">
              Real-time market intelligence, whale tracking, and advanced insights for serious traders
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/scanner" className="btn-primary group">
                <BarChart2 size={20} />
                Explore Markets
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/whales" className="btn-outline">
                <TrendingUp size={20} />
                Track Whales
              </Link>
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                Trending Markets
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Most active prediction markets right now
              </p>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingMarkets.map((market, index) => {
                  let yesPrice = 0.5, noPrice = 0.5;
                  try {
                    const prices = typeof market.outcomePrices === 'string' ? JSON.parse(market.outcomePrices) : market.outcomePrices;
                    if (Array.isArray(prices) && prices.length >= 2) {
                      yesPrice = parseFloat(prices[0]) || 0.5;
                      noPrice = parseFloat(prices[1]) || 0.5;
                    }
                  } catch (e) {}

                  return (
                    <div key={market.id} style={{ animationDelay: `${index * 100}ms` }} className="fade-in-up">
                      <MarketCard
                        title={market.question}
                        volume={`$${parseInt(market.volume || '0').toLocaleString()}`}
                        yesPrice={yesPrice}
                        noPrice={noPrice}
                        isTrending={true}
                        marketId={market.conditionId}
                        slug={market.slug}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 border-y border-gray-200/50 dark:border-gray-700/30 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 md:gap-16 max-w-5xl mx-auto">
            {[
              { value: stats.volume, label: 'Volume Tracked', icon: '📊' },
              { value: stats.markets, label: 'Active Markets', icon: '🎯' },
              { value: stats.traders, label: 'Traders', icon: '👥' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Why PolyMerit?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Professional tools for serious prediction market traders
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: BarChart2, title: 'Real-Time Signals', desc: 'Track order flow and whale movements in real-time with advanced analytics.', gradient: 'from-purple-500 to-indigo-500' },
              { icon: Shield, title: 'Enterprise Security', desc: 'Secure API integration with Polymarket using industry-standard protocols.', gradient: 'from-indigo-500 to-blue-500' },
              { icon: Zap, title: 'Advanced Analytics', desc: 'Deep market insights and trend analysis powered by real-time data.', gradient: 'from-blue-500 to-cyan-500' },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 text-center group">
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={36} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
