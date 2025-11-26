import { NextRequest, NextResponse } from 'next/server';
import { getPriceHistory } from '@/lib/polymarket';

export async function GET(
    request: NextRequest,
    { params }: { params: { conditionId: string } }
) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const interval = (searchParams.get('interval') as '1d' | '1w' | '1m' | 'all') || '1d';

        const data = await getPriceHistory(params.conditionId, interval);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Price history API error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
