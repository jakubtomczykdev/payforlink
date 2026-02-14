import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    try {
        const visit = await prisma.visit.findUnique({
            where: { unlockToken: token },
            select: { isUnlocked: true }
        });

        if (!visit) {
            return NextResponse.json({ error: 'Visit not found' }, { status: 404 });
        }

        return NextResponse.json({ unlocked: visit.isUnlocked });
    } catch (error) {
        console.error('Check Status Error:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
