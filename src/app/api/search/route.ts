import { NextResponse } from 'next/server';
import { searchMarkets } from '@/lib/polymarket';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q');
        
        if (!q) {
            return NextResponse.json(
                { error: 'Search query required' },
                { status: 400 }
            );
        }

        const limit_per_type = parseInt(searchParams.get('limit') || '10');
        const page = parseInt(searchParams.get('page') || '1');

        const results = await searchMarkets({
            q,
            limit_per_type,
            page,
            search_tags: true,
        });

        return NextResponse.json(results);
    } catch (error) {
        console.error('API error searching:', error);
        return NextResponse.json(
            { error: 'Failed to search markets' },
            { status: 500 }
        );
    }
}
