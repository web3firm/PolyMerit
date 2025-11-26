import { NextRequest, NextResponse } from 'next/server';
import { getTrades } from '@/lib/polymarket';

export async function GET(
    request: NextRequest,
    { params }: { params: { conditionId: string } }
) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '20');

        const data = await getTrades(params.conditionId, limit);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Trades API error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
