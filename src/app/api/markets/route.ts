import { NextResponse } from 'next/server';
import { getMarkets } from '@/lib/polymarket';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '12');
        const offset = parseInt(searchParams.get('offset') || '0');
        const sort = searchParams.get('sort') as any || 'volume';
        const order = searchParams.get('order') || 'DESC';
        const tag_id = searchParams.get('tag_id') || undefined;
        const active = searchParams.get('active') !== 'false';

        const markets = await getMarkets({
            limit,
            offset,
            active,
            order: order as any,
            tag_id,
        });

        // Sort on our side if needed
        const sortedMarkets = [...markets].sort((a, b) => {
            if (sort === 'volume') {
                const volA = parseFloat(a.volume || '0');
                const volB = parseFloat(b.volume || '0');
                return order === 'DESC' ? volB - volA : volA - volB;
            }
            return 0;
        });

        return NextResponse.json(sortedMarkets);
    } catch (error) {
        console.error('API error fetching markets:', error);
        return NextResponse.json(
            { error: 'Failed to fetch markets' },
            { status: 500 }
        );
    }
}
