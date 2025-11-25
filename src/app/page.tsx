'use client';

import Link from 'next/link';
import { BarChart2, Shield, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getMarkets, Market } from '@/lib/polymarket';
import MarketCard from '@/components/MarketCard';
import SkeletonCard from '@/components/SkeletonCard';

export default function Home() {
  const [stats, setStats] = useState({
    volume: '...',
    markets: '...',
    traders: '...',
  });
  const [trendingMarkets, setTrendingMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const markets = await getMarkets({ limit: 6, active: true, sort: 'volume', order: 'DESC' });

        if (markets.length > 0) {
          const totalVolume = markets.reduce((sum, m) => sum + parseFloat(m.volume || '0'), 0);
          const volumeInMillions = (totalVolume / 1000000).toFixed(0);

          setStats({
            volume: `$${volumeInMillions}M`,
            markets: `${markets.length}`,
            traders: '100K+',
          });

          setTrendingMarkets(markets.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">


          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-gray-900">Predict the Future.</span>
            <br />
            <span className="text-gray-900">Trade the Outcome.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Enterprise-grade analytics for Polymarket. Real-time order flow, whale tracking,
            and advanced market insights.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/scanner" className="btn-primary px-6 py-3 text-base">
              <BarChart2 size={20} />
              Explore Markets
            </Link>
            <Link href="/whales" className="btn-outline px-6 py-3 text-base flex items-center gap-2">
              <TrendingUp size={20} />
              Track Whales
            </Link>
          </motion.div>

          {/* Trending Markets Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-6xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Markets</h2>

            {loading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {trendingMarkets.map((market) => {
                  let yesPrice = 0.5;
                  let noPrice = 0.5;
                  try {
                    if (typeof market.outcomePrices === 'string') {
                      const prices = JSON.parse(market.outcomePrices);
                      if (Array.isArray(prices) && prices.length >= 2) {
                        yesPrice = parseFloat(prices[0]) || 0.5;
                        noPrice = parseFloat(prices[1]) || 0.5;
                      }
                    } else if (Array.isArray(market.outcomePrices) && market.outcomePrices.length >= 2) {
                      yesPrice = parseFloat(market.outcomePrices[0]) || 0.5;
                      noPrice = parseFloat(market.outcomePrices[1]) || 0.5;
                    }
                  } catch (e) {
                    console.error('Error parsing prices:', e);
                  }

                  return (
                    <MarketCard
                      key={market.id}
                      title={market.question}
                      volume={`$${parseInt(market.volume || '0').toLocaleString()}`}
                      yesPrice={yesPrice}
                      noPrice={noPrice}
                      isTrending={true}
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: stats.volume, label: 'Volume Tracked' },
              { value: stats.markets, label: 'Active Markets' },
              { value: stats.traders, label: 'Traders' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why PolyMerit?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional tools for serious prediction market traders
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart2,
                title: 'Real-Time Signals',
                desc: 'Track order flow and whale movements in real-time.',
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                desc: 'Secure API integration with Polymarket.',
              },
              {
                icon: Zap,
                title: 'Advanced Analytics',
                desc: 'Deep market insights and trend analysis.',
              },
            ].map((feature, i) => (
              <div key={i} className="card text-center group">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600 transition-colors">
                  <feature.icon size={32} className="text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
