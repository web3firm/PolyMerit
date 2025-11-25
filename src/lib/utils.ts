/**
 * Safe number parsing utilities
 */

export const toNumber = (val: any, fallback = 0): number => {
    if (val === null || val === undefined) return fallback;
    const n = typeof val === 'string' ? parseFloat(val) : Number(val);
    return Number.isFinite(n) ? n : fallback;
};

export const formatVolume = (volume: string | number): string => {
    const num = toNumber(volume);
    if (num >= 1000000) {
        return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
        return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toFixed(0)}`;
};

export const formatPrice = (price: string | number): number => {
    return toNumber(price, 0.5);
};
