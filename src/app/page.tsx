'use client';

import Link from 'next/link';
import { ArrowRight, Eye, BarChart2, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getMarkets } from '@/lib/polymarket';

export default function Home() {
  const [stats, setStats] = useState({
    volume: '100M+',
    predictions: '330M+',
    users: '4M+',
    uptime: '99.9%'
  });

  useEffect(() => {
    // Fetch real stats from Polymarket
    async function fetchStats() {
      try {
        const markets = await getMarkets({ limit: 100, active: true });
        if (markets.length > 0) {
          const totalVolume = markets.reduce((sum, m) => sum + parseFloat(m.volume || '0'), 0);
          const volumeInMillions = (totalVolume / 1000000).toFixed(0);
          setStats(prev => ({
            ...prev,
            volume: `$${volumeInMillions}M+`,
            predictions: `${markets.length}+`,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-8"
          >
            <div className="badge">
              <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
              <span>AI-Powered Market Intelligence</span>
            </div>
          </motion.div>

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
            The enterprise-grade interface for Polymarket. Real-time order flow, whale tracking,
            and advanced analytics for the world's prediction market.
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
              Start for free
            </Link>
            <button className="btn-outline px-6 py-3 text-base flex items-center gap-2">
              <Eye size={20} />
              Watch demo
            </button>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-soft border border-gray-200 bg-white">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="text-xs text-gray-500 bg-white px-3 py-1 rounded-md border border-gray-200">
                    polymerit.app/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard Content - Simplified */}
              <div className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <BarChart2 size={64} className="text-purple-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Real-Time Analytics Dashboard</h3>
                  <p className="text-gray-600">Track markets, whales, and predictions in one place</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: stats.volume, label: 'Volume Tracked' },
              { value: stats.predictions, label: 'Active Markets' },
              { value: stats.users, label: 'Traders Worldwide' },
              { value: stats.uptime, label: 'Uptime' },
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
                desc: 'Millisecond latency on order flow and whale movements.',
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                desc: 'Bank-grade encryption and secure API key management.',
              },
              {
                icon: Zap,
                title: 'Advanced Analytics',
                desc: 'Deep market insights with AI-powered predictions.',
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
