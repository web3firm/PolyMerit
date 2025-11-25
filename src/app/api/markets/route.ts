import { NextResponse } from 'next/server';
import { getMarkets } from '@/lib/polymarket';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '12');
        const sort = searchParams.get('sort') || 'volume';
        const order = searchParams.get('order') || 'DESC';

        const markets = await getMarkets({
            limit,
            active: true,
            sort: sort as any,
            order: order as any,
        });

        return NextResponse.json(markets);
    } catch (error) {
        console.error('API error fetching markets:', error);
        return NextResponse.json(
            { error: 'Failed to fetch markets' },
            { status: 500 }
        );
    }
}
