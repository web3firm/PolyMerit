'use client';

import { TrendingUp, Activity, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface MarketCardProps {
    title: string;
    volume: string;
    yesPrice: number;
    noPrice: number;
    isTrending?: boolean;
    marketId?: string;
    slug?: string;
}

export default function MarketCard({ title, volume, yesPrice, noPrice, isTrending, marketId, slug }: MarketCardProps) {
    const yesPercent = Math.round(yesPrice * 100);
    const noPercent = Math.round(noPrice * 100);
    
    // Use slug for internal routing to market detail page
    const internalLink = slug ? `/market/${slug}` : null;

    const cardContent = (
        <div className="market-card h-full flex flex-col group relative overflow-hidden">
            {isTrending && (
                <div className="absolute top-4 right-4 px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center gap-1 z-10 shadow-lg">
                    <TrendingUp size={12} />
                    HOT
                </div>
            )}

            <h3 className="text-lg font-bold text-primary line-clamp-2 mb-4 pr-16 leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {title}
            </h3>

            <div className="flex items-center gap-2 text-sm text-secondary mb-6">
                <Activity size={14} className="text-purple-500" />
                <span className="font-semibold">{volume}</span>
            </div>

            <div className="mt-auto space-y-4">
                <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-green-600">YES</span>
                        <span className="text-lg font-black text-green-600">{yesPercent}%</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500 shadow-lg" style={{ width: `${yesPercent}%` }} />
                    </div>
                </div>

                <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-red-600">NO</span>
                        <span className="text-lg font-black text-red-600">{noPercent}%</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-500 shadow-lg" style={{ width: `${noPercent}%` }} />
                    </div>
                </div>
            </div>

            {slug && (
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink size={16} className="text-purple-500" />
                </div>
            )}
        </div>
    );

    // Link to internal market detail page if slug available
    if (internalLink) {
        return <Link href={internalLink} className="block">{cardContent}</Link>;
    }

    if (marketId) {
        return <Link href={`/market/${marketId}`} className="block">{cardContent}</Link>;
    }

    return <div className="block">{cardContent}</div>;
}
