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
    console.log(`[POSTBACK] Received: ${request.url}`);
    const searchParams = request.nextUrl.searchParams;
    console.log(`[POSTBACK] Params: ${JSON.stringify(Object.fromEntries(searchParams))}`);

    // 1. Extract Parameters
    // New Plan: sub1=userId, sub2=shortCode, sub3=token
    const p_userId = searchParams.get('userId') || searchParams.get('sub1');
    const p_shortCode = searchParams.get('shortCode') || searchParams.get('sub2');
    const p_visitToken = searchParams.get('visitToken') || searchParams.get('sub3');

    // Legacy Fallback (sub2=userId, sub3=shortCode, sub5=token)
    const legacy_userId = searchParams.get('sub2');
    const legacy_shortCode = searchParams.get('sub3');
    const legacy_visitToken = searchParams.get('sub5');

    const userId = p_userId || legacy_userId;
    const shortCode = p_shortCode || legacy_shortCode;
    const visitToken = p_visitToken || legacy_visitToken;

    // Fix payout comma issue (e.g. "2,50" -> "2.50")
    let rawPayout = searchParams.get('payout') || '0';
    rawPayout = rawPayout.replace(',', '.');
    const payout = parseFloat(rawPayout);

    const currency = searchParams.get('currency') || 'PLN';
    const status = searchParams.get('status');

    // 2. Validate
    if (!userId || !shortCode || payout <= 0) {
        console.error(`[POSTBACK] Validation Failed: userId=${userId}, shortCode=${shortCode}, payout=${payout}`);

        // DEBUG: Try to notify the user if we at least have a userId
        if (userId) {
            try {
                const userExists = await prisma.user.findUnique({ where: { id: userId } });
                if (userExists) {
                    await prisma.notification.create({
                        data: {
                            userId,
                            type: 'SYSTEM',
                            title: 'Postback Error (Debug)',
                            message: `Otrzymano Postback, ale brakuje danych. Params: ${JSON.stringify(Object.fromEntries(searchParams))}. UserId: ${userId}, ShortCode: ${shortCode}, Payout: ${payout}`,
                            isRead: false
                        }
                    });
                }
            } catch (e) {
                console.error("Failed to send debug notification", e);
            }
        }
        return NextResponse.json({ error: 'Invalid parameters', params: Object.fromEntries(searchParams) }, { status: 400 });
    }

    try {
        // 1. Verify User and Link exist
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const link = await prisma.link.findUnique({ where: { shortCode } });
        if (!link) return NextResponse.json({ error: 'Link not found' }, { status: 404 });

        // Create Notification with Debug Info
        const debugInfo = `(Debug: userId=${userId}, shortCode=${shortCode}, token=${visitToken || 'NULL'}, sub1=${searchParams.get('sub1')}, sub2=${searchParams.get('sub2')}, sub3=${searchParams.get('sub3')}, sub5=${searchParams.get('sub5')})`;

        const queries: any[] = [
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
                    type: 'BONUS',
                    title: 'Nowe Środki (CPA) - Debug',
                    message: `Otrzymałeś ${payout} ${currency} z linku /${shortCode}. ${debugInfo}`,
                    isRead: false
                }
            })
        ];

        // NEW: If we have a visitToken, unlock the visit!
        if (visitToken) {
            queries.push(
                prisma.visit.update({
                    where: { unlockToken: visitToken },
                    data: { isUnlocked: true }
                })
            );
        }

        // Execute Transaction
        await prisma.$transaction(queries);

        return NextResponse.json({ success: true, message: 'Postback processed' });

    } catch (error) {
        console.error('Postback Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
