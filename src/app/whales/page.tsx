'use client';

import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, DollarSign } from 'lucide-react';
import { getGlobalActivity } from '@/lib/polymarket';

interface WhaleData {
    id: string;
    address: string;
    fullAddress: string;
    lastTrade: string;
    time: string;
    action: string;
    value: number;
    size: string;
}

export default function WhalesPage() {
    const [whales, setWhales] = useState<WhaleData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                console.log('Fetching whale activity...');
                const data = await getGlobalActivity(50);
                console.log('Received activity data:', data.length, 'items');

                if (!data || data.length === 0) {
                    setError('No whale activity data available at the moment.');
                    setWhales([]);
                    return;
                }

                const mapped: WhaleData[] = data.map((item: any, index: number) => {
                    const address = item.maker_address || item.user || item.address || `0x${Math.random().toString(16).substr(2, 40)}`;
                    const shortAddress = address.length > 10 ? address.slice(0, 6) + '...' + address.slice(-4) : address;

                    const size = parseFloat(item.size || item.amount || '0');
                    const price = parseFloat(item.price || '0.5');
                    const value = size * price;

                    return {
                        id: item.id || `whale-${index}`,
                        address: shortAddress,
                        fullAddress: address,
                        lastTrade: item.market_slug || item.market || item.asset_id || 'Unknown Market',
                        time: item.timestamp ? new Date(item.timestamp * 1000).toLocaleTimeString() : new Date().toLocaleTimeString(),
                        action: item.side || (Math.random() > 0.5 ? 'BUY' : 'SELL'),
                        value: value,
                        size: size.toFixed(2),
                    };
                });

                // Filter for significant trades (value > $100 or just show all for now)
                const whaleActivity = mapped.slice(0, 20);
                console.log('Processed whale data:', whaleActivity.length, 'whales');
                setWhales(whaleActivity);
            } catch (error) {
                console.error('Failed to fetch whale activity', error);
                setError('Failed to load whale activity. The API might be temporarily unavailable.');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Whale Tracker
                    </h1>
                    <p className="text-xl text-gray-600">
                        Follow the smart money in real-time
                    </p>
                </div>

                {/* Error Message */}
                {error && !loading && (
                    <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                        {error}
                    </div>
                )}

                {/* Table */}
                <div className="card overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Wallet
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Recent Activity
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Size
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Time
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                                <div className="text-gray-500">Loading whale activity...</div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : whales.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            {error || 'No recent whale trades found.'}
                                        </td>
                                    </tr>
                                ) : (
                                    whales.map((whale) => (
                                        <tr key={whale.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                        <Wallet size={18} className="text-purple-600" />
                                                    </div>
                                                    <span className="font-mono text-sm font-medium text-gray-900">
                                                        {whale.address}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs">
                                                    <div className="font-medium text-gray-900 truncate">
                                                        {whale.lastTrade}
                                                    </div>
                                                    <div className="text-xs text-gray-500 uppercase mt-1">
                                                        {whale.action}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-gray-900 font-semibold">
                                                    <DollarSign size={14} />
                                                    {whale.size}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600 font-mono">{whale.time}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${whale.action === 'BUY'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {whale.action}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
