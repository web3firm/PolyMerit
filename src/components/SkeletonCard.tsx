export default function SkeletonCard() {
    return (
        <div className="card h-64 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-3 mb-6">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>

            {/* Price bars skeleton */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                    <div className="h-2 bg-green-100 rounded flex-1"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 bg-red-100 rounded flex-1"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                </div>
            </div>

            {/* Footer skeleton */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-6 w-16 bg-purple-100 rounded-full"></div>
            </div>
        </div>
    );
}
