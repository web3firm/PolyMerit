'use client';

import { TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';

interface MarketCardProps {
    title: string;
    volume: string;
    yesPrice: number;
    noPrice: number;
    isTrending?: boolean;
}

export default function MarketCard({ title, volume, yesPrice, noPrice, isTrending }: MarketCardProps) {
    const yesPercent = Math.round(yesPrice * 100);
    const noPercent = Math.round(noPrice * 100);

    return (
        <Link href="#" className="block group">
            <div className="card h-full flex flex-col hover:shadow-xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2 flex-1 group-hover:text-purple-600 transition-colors">
                        {title}
                    </h3>
                    {isTrending && (
                        <div className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full flex items-center gap-1">
                            <TrendingUp size={12} />
                            HOT
                        </div>
                    )}
                </div>

                {/* Volume */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Activity size={14} />
                    <span>Vol: {volume}</span>
                </div>

                {/* Probability Bars */}
                <div className="mt-auto space-y-3">
                    {/* YES Bar */}
                    <div className="relative">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-gray-700">YES</span>
                            <span className="text-sm font-bold text-green-600">{yesPercent}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 rounded-full transition-all"
                                style={{ width: `${yesPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* NO Bar */}
                    <div className="relative">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-gray-700">NO</span>
                            <span className="text-sm font-bold text-red-600">{noPercent}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-500 rounded-full transition-all"
                                style={{ width: `${noPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
