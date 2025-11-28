import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

// GET - Fetch user's watchlist
export async function GET() {
    try {
        const session = await auth();
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const watchlist = await db.watchlist.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(watchlist);
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 });
    }
}

// POST - Add to watchlist
export async function POST(req: Request) {
    try {
        const session = await auth();
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { marketId, slug, title } = await req.json();

        if (!marketId || !slug) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const item = await db.watchlist.upsert({
            where: {
                userId_marketId: {
                    userId: session.user.id,
                    marketId,
                },
            },
            update: { title },
            create: {
                userId: session.user.id,
                marketId,
                slug,
                title,
            },
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        return NextResponse.json({ error: 'Failed to add to watchlist' }, { status: 500 });
    }
}

// DELETE - Remove from watchlist
export async function DELETE(req: Request) {
    try {
        const session = await auth();
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const marketId = searchParams.get('marketId');

        if (!marketId) {
            return NextResponse.json({ error: 'Missing marketId' }, { status: 400 });
        }

        await db.watchlist.delete({
            where: {
                userId_marketId: {
                    userId: session.user.id,
                    marketId,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        return NextResponse.json({ error: 'Failed to remove from watchlist' }, { status: 500 });
    }
}
