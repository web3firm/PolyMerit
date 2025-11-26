'use client';

export default function SkeletonCard() {
    return (
        <div className="market-card h-full animate-pulse">
            <div className="h-4 bg-secondary rounded-lg w-3/4 mb-4"></div>
            <div className="h-3 bg-secondary rounded-lg w-1/2 mb-6"></div>
            <div className="space-y-4 mt-auto">
                <div>
                    <div className="h-2 bg-secondary rounded-full mb-2"></div>
                    <div className="h-3 bg-secondary rounded-full"></div>
                </div>
                <div>
                    <div className="h-2 bg-secondary rounded-full mb-2"></div>
                    <div className="h-3 bg-secondary rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
