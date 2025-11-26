import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/polymarket';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');
        const order = searchParams.get('order') as any || 'volume';
        const ascending = searchParams.get('ascending') === 'true';
        const active = searchParams.get('active') !== 'false';
        const tag_id = searchParams.get('tag_id') || undefined;

        const events = await getEvents({
            limit,
            offset,
            order,
            ascending,
            active,
            tag_id,
        });

        return NextResponse.json(events);
    } catch (error) {
        console.error('API error fetching events:', error);
        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        );
    }
}
