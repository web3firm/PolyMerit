const BASE_URL = 'https://gamma-api.polymarket.com';

// Builder / Affiliate Config
export const getBuilderConfig = () => {
    return {
        builderAddress: process.env.NEXT_PUBLIC_BUILDER_ADDRESS,
        apiKey: process.env.POLYMARKET_API_KEY,
        secret: process.env.POLYMARKET_SECRET,
        passphrase: process.env.POLYMARKET_PASSPHRASE
    };
};

export interface Market {
    id: string;
    question: string;
    slug: string;
    volume: string;
    outcomePrices: string[];
    clobTokenIds: string[];
    startDate: string;
    endDate: string;
    category: string;
    image: string;
    active: boolean;
    closed: boolean;
    archived: boolean;
    description: string;
    tags: string[];
    volume24hr?: string;
    liquidity?: string;
}

export interface Trade {
    id: string;
    marketId: string;
    assetId: string;
    price: string;
    size: string;
    timestamp: string;
    side: 'BUY' | 'SELL';
    makerAddress: string;
    takerAddress: string;
    amount?: string; // Derived or raw
    marketSlug?: string; // Optional if we can link it
}

interface GetMarketsParams {
    limit?: number;
    offset?: number;
    order?: 'ASC' | 'DESC';
    active?: boolean;
    closed?: boolean;
    tag_id?: string;
    slug?: string;
    sort?: 'volume' | 'createdAt' | 'endDate';
}

export async function getMarkets(params: GetMarketsParams = {}): Promise<Market[]> {
    const searchParams = new URLSearchParams();

    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.offset) searchParams.append('offset', params.offset.toString());
    if (params.order) searchParams.append('order', params.order);
    if (params.active !== undefined) searchParams.append('active', params.active.toString());
    if (params.closed !== undefined) searchParams.append('closed', params.closed.toString());
    if (params.tag_id) searchParams.append('tag_id', params.tag_id);
    if (params.slug) searchParams.append('slug', params.slug);
    if (params.sort) searchParams.append('sort', params.sort);

    try {
        const response = await fetch(`${BASE_URL}/markets?${searchParams.toString()}`);
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Failed to fetch markets:', error);
        return [];
    }
}

export async function getMarket(id: string): Promise<Market | null> {
    try {
        const response = await fetch(`${BASE_URL}/markets/${id}`);
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch market ${id}:`, error);
        return null;
    }
}

export async function getGlobalActivity(limit: number = 20): Promise<any[]> {
    try {
        const response = await fetch(`${BASE_URL}/activity?limit=${limit}`);
        if (!response.ok) {
            console.warn('Activity endpoint might not be available or different.');
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch activity:', error);
        return [];
    }
}
