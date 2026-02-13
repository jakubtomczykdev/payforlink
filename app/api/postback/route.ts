import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// MyLead Postback Handler
// URL: /api/postback
// Method: GET or POST (MyLead usually uses GET by default but can be configured)
// Params expected:
// - sub2: User ID
// - sub3: Short Code (Link ID)
// - payout: Amount
// - currency: Currency (e.g. PLN, USD)
// - status: Conversion status (optional, usually "1" or "approved")

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('sub2');
    const shortCode = searchParams.get('sub3');
    const payout = parseFloat(searchParams.get('payout') || '0');
    const currency = searchParams.get('currency') || 'PLN';
    const status = searchParams.get('status'); // approved, rejected, etc. (Check MyLead docs, usually '1' or 'approved')

    // Basic Validation
    if (!userId || !shortCode || payout <= 0) {
        return NextResponse.json({ error: 'Invalid parameters', params: Object.fromEntries(searchParams) }, { status: 400 });
    }

    try {
        // 1. Verify User and Link exist
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const link = await prisma.link.findUnique({ where: { shortCode } });
        if (!link) return NextResponse.json({ error: 'Link not found' }, { status: 404 });

        // 2. Update Balances (Atomic Transaction)
        await prisma.$transaction([
            // Update User Wallet
            prisma.user.update({
                where: { id: userId },
                data: {
                    walletBalance: { increment: payout },
                    lifetimeEarnings: { increment: payout }
                }
            }),
            // Update Link Stats
            prisma.link.update({
                where: { shortCode },
                data: {
                    earnings: { increment: payout }
                }
            }),
            // Create Notification
            prisma.notification.create({
                data: {
                    userId,
                    type: 'BONUS', // Or a new type 'EARNING'
                    title: 'Nowe Środki (CPA)',
                    message: `Otrzymałeś ${payout} ${currency} z linku /${shortCode} (Zadanie wykonane).`,
                    isRead: false
                }
            })
        ]);

        return NextResponse.json({ success: true, message: 'Postback processed' });

    } catch (error) {
        console.error('Postback Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
