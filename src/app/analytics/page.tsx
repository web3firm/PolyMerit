'use client';

import { BarChart2, Activity, Layers, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Advanced Analytics
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Deep dive into market liquidity, order flow, and sentiment
                        </p>
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-blue-800 dark:text-blue-300 text-sm">
                                📊 <strong>Coming Soon:</strong> Real-time charts and advanced analytics are being integrated with live Polymarket data.
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
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <BarChart2 size={20} className="text-purple-600" />
                                        Market Depth & Volume
                                    </h3>
                                    <div className="flex gap-2">
                                        {['1H', '4H', '1D', '1W'].map((tf) => (
                                            <button
                                                key={tf}
                                                className="px-3 py-1 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-purple-600 hover:text-white transition-colors"
                                            >
                                                {tf}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-80 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="text-center">
                                        <BarChart2 size={48} className="text-purple-400 mx-auto mb-3" />
                                        <p className="text-gray-600 dark:text-gray-300">Interactive charts coming soon</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Integrating with Polymarket real-time data</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Flow Placeholder */}
                            <div className="card">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Activity size={20} className="text-purple-600" />
                                    Live Order Flow
                                </h3>
                                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="text-center">
                                        <Activity size={48} className="text-purple-400 mx-auto mb-3" />
                                        <p className="text-gray-600 dark:text-gray-300">Real-time order flow coming soon</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Widgets */}
                        <div className="space-y-6">
                            {/* Orderbook Placeholder */}
                            <div className="card">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Layers size={20} className="text-purple-600" />
                                    Orderbook
                                </h3>
                                <div className="h-96 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="text-center">
                                        <Layers size={48} className="text-purple-400 mx-auto mb-3" />
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">Live orderbook data</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Coming soon</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sentiment Placeholder */}
                            <div className="card">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-purple-600" />
                                    Market Sentiment
                                </h3>
                                <div className="space-y-4">
                                    <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <TrendingUp size={48} className="text-purple-400 mx-auto mb-3" />
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">AI-powered sentiment</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Coming soon</p>
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
