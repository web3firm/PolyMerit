'use client';

import { BarChart2, Activity, Layers, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen py-12 bg-secondary">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-4">
                            <BarChart2 size={16} className="text-accent" />
                            <span className="text-sm font-medium text-accent">Advanced Analytics</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                            Market Intelligence Hub
                        </h1>
                        <p className="text-lg text-secondary mb-6">
                            Deep dive into market liquidity, order flow, and sentiment analysis
                        </p>
                        <div className="p-4 rounded-xl border-2 border-accent/20 bg-accent/5">
                            <p className="text-primary text-sm">
                                📊 <strong className="text-accent">Coming Soon:</strong> Real-time charts and advanced analytics are being integrated with live Polymarket data.
                            </p>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Main Chart Area */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Price Chart Placeholder */}
                            <div className="card">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                                        <BarChart2 size={20} className="text-accent" />
                                        Market Depth & Volume
                                    </h3>
                                    <div className="flex gap-2">
                                        {['1H', '4H', '1D', '1W'].map((tf) => (
                                            <button
                                                key={tf}
                                                className="px-3 py-1 text-sm rounded-lg bg-secondary hover:bg-accent hover:text-white transition-colors text-secondary"
                                            >
                                                {tf}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-80 flex items-center justify-center bg-secondary rounded-lg border border-primary">
                                    <div className="text-center">
                                        <BarChart2 size={48} className="text-accent mx-auto mb-3 opacity-50" />
                                        <p className="text-primary font-medium">Interactive charts coming soon</p>
                                        <p className="text-sm text-secondary mt-2">Integrating with Polymarket real-time data</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Flow Placeholder */}
                            <div className="card">
                                <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
                                    <Activity size={20} className="text-accent" />
                                    Live Order Flow
                                </h3>
                                <div className="h-64 flex items-center justify-center bg-secondary rounded-lg border border-primary">
                                    <div className="text-center">
                                        <Activity size={48} className="text-accent mx-auto mb-3 opacity-50" />
                                        <p className="text-primary font-medium">Real-time order flow coming soon</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Widgets */}
                        <div className="space-y-6">
                            {/* Orderbook Placeholder */}
                            <div className="card">
                                <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
                                    <Layers size={20} className="text-accent" />
                                    Orderbook
                                </h3>
                                <div className="h-96 flex items-center justify-center bg-secondary rounded-lg border border-primary">
                                    <div className="text-center">
                                        <Layers size={48} className="text-accent mx-auto mb-3 opacity-50" />
                                        <p className="text-primary text-sm font-medium">Live orderbook data</p>
                                        <p className="text-xs text-secondary mt-2">Coming soon</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sentiment Placeholder */}
                            <div className="card">
                                <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-accent" />
                                    Market Sentiment
                                </h3>
                                <div className="space-y-4">
                                    <div className="text-center p-8 bg-secondary rounded-lg border border-primary">
                                        <TrendingUp size={48} className="text-accent mx-auto mb-3 opacity-50" />
                                        <p className="text-primary text-sm font-medium">AI-powered sentiment</p>
                                        <p className="text-xs text-secondary mt-2">Coming soon</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
