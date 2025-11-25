import { NextResponse } from 'next/server';
import { getGlobalActivity } from '@/lib/polymarket';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '50');

        const activity = await getGlobalActivity(limit);

        return NextResponse.json(activity);
    } catch (error) {
        console.error('API error fetching whale activity:', error);
        return NextResponse.json(
            { error: 'Failed to fetch whale activity' },
            { status: 500 }
        );
    }
}
