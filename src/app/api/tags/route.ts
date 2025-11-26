import { NextResponse } from 'next/server';
import { getTags } from '@/lib/polymarket';

export async function GET() {
    try {
        const tags = await getTags();
        return NextResponse.json(tags);
    } catch (error) {
        console.error('API error fetching tags:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tags' },
            { status: 500 }
        );
    }
}
