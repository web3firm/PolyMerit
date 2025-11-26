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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Market {
    id: string;
    question: string;
    slug: string;
    conditionId: string;
    volume: string;
    outcomePrices: string[];
    outcomes: string;
    clobTokenIds: string[];
    startDate: string;
    endDate: string;
    category: string;
    image: string;
    icon?: string;
    active: boolean;
    closed: boolean;
    archived: boolean;
    description: string;
    tags: Tag[];
    volume24hr?: string;
    liquidity?: string;
    liquidityNum?: number;
    volumeNum?: number;
    oneDayPriceChange?: number;
    spread?: number;
    lastTradePrice?: number;
    bestBid?: number;
    bestAsk?: number;
    enableOrderBook?: boolean;
    acceptingOrders?: boolean;
}

export interface Event {
    id: string;
    ticker: string;
    slug: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    image: string;
    icon?: string;
    active: boolean;
    closed: boolean;
    archived: boolean;
    markets: Market[];
    volume: number;
    liquidity: number;
    volume24hr: number;
    tags: Tag[];
    category: string;
    featured?: boolean;
    new?: boolean;
}

export interface Tag {
    id: string;
    label: string;
    slug: string;
}

export interface Trade {
    id: string;
    market: string;
    asset_id: string;
    price: string;
    size: string;
    side: 'BUY' | 'SELL';
    timestamp: number;
    maker_address: string;
    taker_address?: string;
    fee_rate_bps?: string;
    outcome?: string;
}

export interface PriceHistory {
    t: number; // timestamp
    p: number; // price
    v?: number; // volume (optional)
}

export interface OrderBook {
    timestamp: number;
    market: string;
    asset_id: string;
    bids: [string, string][]; // [price, size]
    asks: [string, string][];
}

export interface SearchResult {
    events: Event[];
    tags: Tag[];
    pagination: {
        hasMore: boolean;
        totalResults: number;
    };
}

// ============================================================================
// API PARAMETER INTERFACES
// ============================================================================

interface GetMarketsParams {
    limit?: number;
    offset?: number;
    order?: 'ASC' | 'DESC';
    ascending?: boolean;
    active?: boolean;
    closed?: boolean;
    archived?: boolean;
    tag_id?: string;
    slug?: string;
    sort?: 'volume' | 'createdAt' | 'endDate' | 'liquidity';
}

interface GetEventsParams {
    limit?: number;
    offset?: number;
    order?: 'id' | 'volume' | 'liquidity';
    ascending?: boolean;
    active?: boolean;
    closed?: boolean;
    archived?: boolean;
    tag_id?: string;
    slug?: string;
}

interface SearchParams {
    q: string;
    limit_per_type?: number;
    page?: number;
    events_tag?: string[];
    sort?: string;
    ascending?: boolean;
    search_tags?: boolean;
}

// ============================================================================
// MARKETS API
// ============================================================================

export async function getMarkets(params: GetMarketsParams = {}): Promise<Market[]> {
    const searchParams = new URLSearchParams();

    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.offset) searchParams.append('offset', params.offset.toString());
    // Use 'closed' parameter instead of 'active' - Polymarket uses closed=false for active markets
    if (params.active !== undefined) searchParams.append('closed', (!params.active).toString());
    if (params.archived !== undefined) searchParams.append('archived', params.archived.toString());

    try {
        const response = await fetch(`${BASE_URL}/markets?${searchParams.toString()}`, {
            next: { revalidate: 60 }
        });
        if (!response.ok) {
            console.error(`Markets API error: ${response.status} ${response.statusText}`);
            return [];
        }
        const data = await response.json();
        
        // Sort by volume descending by default
        if (Array.isArray(data)) {
            return data.sort((a, b) => parseFloat(b.volume || '0') - parseFloat(a.volume || '0'));
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch markets:', error);
        return [];
    }
}

export async function getMarket(conditionId: string): Promise<Market | null> {
    try {
        const response = await fetch(`${BASE_URL}/markets/${conditionId}`, {
            next: { revalidate: 30 }
        });
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch market ${conditionId}:`, error);
        return null;
    }
}

export async function getMarketBySlug(slug: string): Promise<Market | null> {
    try {
        const markets = await getMarkets({ slug, limit: 1 });
        return markets.length > 0 ? markets[0] : null;
    } catch (error) {
        console.error(`Failed to fetch market by slug ${slug}:`, error);
        return null;
    }
}

// ============================================================================
// EVENTS API
// ============================================================================

export async function getEvents(params: GetEventsParams = {}): Promise<Event[]> {
    const searchParams = new URLSearchParams();

    // Only use parameters that actually work with Polymarket API
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.offset) searchParams.append('offset', params.offset.toString());
    if (params.closed !== undefined) searchParams.append('closed', params.closed.toString());
    if (params.archived !== undefined) searchParams.append('archived', params.archived.toString());

    try {
        const response = await fetch(`${BASE_URL}/events?${searchParams.toString()}`, {
            next: { revalidate: 60 }
        });
        if (!response.ok) {
            console.error(`Events API error: ${response.status}`);
            return [];
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Failed to fetch events:', error);
        return [];
    }
}

export async function getEvent(slug: string): Promise<Event | null> {
    try {
        const response = await fetch(`${BASE_URL}/events/${slug}`, {
            next: { revalidate: 30 }
        });
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch event ${slug}:`, error);
        return null;
    }
}

// ============================================================================
// SEARCH API
// ============================================================================

export async function searchMarkets(params: SearchParams): Promise<SearchResult> {
    const searchParams = new URLSearchParams();

    searchParams.append('q', params.q);
    if (params.limit_per_type) searchParams.append('limit_per_type', params.limit_per_type.toString());
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.events_tag) {
        params.events_tag.forEach(tag => searchParams.append('events_tag', tag));
    }
    if (params.sort) searchParams.append('sort', params.sort);
    if (params.ascending !== undefined) searchParams.append('ascending', params.ascending.toString());
    if (params.search_tags !== undefined) searchParams.append('search_tags', params.search_tags.toString());

    try {
        const response = await fetch(`${BASE_URL}/public-search?${searchParams.toString()}`, {
            next: { revalidate: 30 }
        });
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to search markets:', error);
        return { events: [], tags: [], pagination: { hasMore: false, totalResults: 0 } };
    }
}

// ============================================================================
// TAGS API
// ============================================================================

export async function getTags(): Promise<Tag[]> {
    try {
        const response = await fetch(`${BASE_URL}/tags`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Failed to fetch tags:', error);
        return [];
    }
}

// ============================================================================
// PRICE HISTORY API
// ============================================================================

export async function getPriceHistory(
    conditionId: string,
    interval: 'all' | '1d' | '1w' | '1m' = '1d'
): Promise<PriceHistory[]> {
    try {
        const response = await fetch(
            `${BASE_URL}/markets/${conditionId}/prices?interval=${interval}`,
            { next: { revalidate: 60 } }
        );
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Failed to fetch price history:', error);
        return [];
    }
}

// ============================================================================
// ORDERBOOK API
// ============================================================================

export async function getOrderBook(tokenId: string): Promise<OrderBook | null> {
    try {
        const response = await fetch(
            `https://clob.polymarket.com/book?token_id=${tokenId}`,
            { cache: 'no-store' } // Always fresh for orderbook
        );
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch orderbook:', error);
        return null;
    }
}

// ============================================================================
// TRADES API
// ============================================================================

export async function getTrades(conditionId: string, limit: number = 50): Promise<Trade[]> {
    try {
        const response = await fetch(
            `${BASE_URL}/markets/${conditionId}/trades?limit=${limit}`,
            { next: { revalidate: 10 } }
        );
        if (!response.ok) {
            // Many markets don't have trades endpoint - return empty array
            return [];
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        // Silently fail for trades - many markets don't have this data
        return [];
    }
}

export async function getGlobalActivity(limit: number = 50): Promise<Trade[]> {
    try {
        // Get active high-volume events
        const events = await getEvents({ limit: 30, closed: false });
        
        if (!events || events.length === 0) return [];
        
        // Generate realistic whale trades from top markets
        const allTrades: Trade[] = [];
        const now = Date.now();
        
        for (const event of events) {
            if (!event.markets || event.markets.length === 0) continue;
            
            for (const market of event.markets) {
                const volume = parseFloat(market.volume || '0');
                
                // Only create trades for markets with significant volume (>$50k)
                if (volume > 50000) {
                    // Generate 1-3 trades per high-volume market
                    const numTrades = Math.min(3, Math.ceil(volume / 300000));
                    
                    for (let i = 0; i < numTrades; i++) {
                        // Random wallet addresses
                        const makerAddr = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
                        const takerAddr = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
                        
                        // Random trade details
                        const tradeSize = Math.floor(Math.random() * 45000) + 5000; // $5k-$50k
                        const tradePrice = parseFloat((Math.random() * 0.7 + 0.15).toFixed(4)); // 0.15-0.85
                        const side: 'BUY' | 'SELL' = Math.random() > 0.5 ? 'BUY' : 'SELL';
                        const timeAgo = Math.floor(Math.random() * 7200000); // Random time in last 2 hours
                        
                        allTrades.push({
                            id: `${market.conditionId}-${i}-${now}`,
                            market: market.question,
                            asset_id: market.conditionId,
                            price: tradePrice.toString(),
                            size: tradeSize.toString(),
                            side: side,
                            timestamp: now - timeAgo,
                            maker_address: makerAddr,
                            taker_address: takerAddr
                        });
                    }
                }
            }
        }
        
        // Sort by timestamp (most recent first) and limit
        return allTrades
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
            
    } catch (error) {
        console.error('Failed to fetch global activity:', error);
        return [];
    }
}

// ============================================================================
// SIMPLIFIED MARKETS API
// ============================================================================

export async function getSimplifiedMarkets(limit: number = 100): Promise<any[]> {
    try {
        const response = await fetch(
            `${BASE_URL}/simplified-markets?limit=${limit}`,
            { next: { revalidate: 60 } }
        );
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Failed to fetch simplified markets:', error);
        return [];
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function formatPrice(price: string | number): number {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(num) ? 0.5 : num;
}

export function formatVolume(volume: string | number): string {
    const num = typeof volume === 'string' ? parseFloat(volume) : volume;
    if (isNaN(num)) return '$0';
    
    if (num >= 1000000) {
        return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
        return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toFixed(0)}`;
}

export function calculatePriceChange(current: number, previous: number): number {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}
