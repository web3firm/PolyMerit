import { NextResponse } from 'next/server';
import { getMarket, getPriceHistory, getTrades } from '@/lib/polymarket';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: conditionId } = await params;
        
        // Fetch market details, price history, and recent trades in parallel
        const [market, priceHistory, trades] = await Promise.all([
            getMarket(conditionId),
            getPriceHistory(conditionId, '1d'),
            getTrades(conditionId, 20),
        ]);

        if (!market) {
            return NextResponse.json(
                { error: 'Market not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            market,
            priceHistory,
            trades,
        });
    } catch (error) {
        console.error('API error fetching market details:', error);
        return NextResponse.json(
            { error: 'Failed to fetch market details' },
            { status: 500 }
        );
    }
}
