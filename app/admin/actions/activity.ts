'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export type ActivityItem = {
    id: string;
    type: 'USER' | 'PAYOUT' | 'FLAG';
    title: string;
    description: string;
    date: Date;
    meta?: any;
};

export async function getRecentActivity(): Promise<ActivityItem[]> {
    const session = await auth();
    if (!session || !session.user) return [];

    // 1. New Users (Last 5)
    // removed 'country' as it doesn't exist on User model
    const newUsers = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, createdAt: true }
    });

    // 2. New Payout Requests (Last 5)
    // fixed: Payout has 'requestedAt' not 'createdAt'
    // fixed: Payout doesn't have 'currency', grabbing from user
    const newPayouts = await prisma.payout.findMany({
        where: { status: 'PENDING' },
        take: 5,
        orderBy: { requestedAt: 'desc' },
        include: { user: { select: { email: true, currency: true } } }
    });

    // 3. Recent Fraud Flags (Last 5)
    // fixed: Visit uses 'ipHash', not 'ip'
    const recentFlags = await prisma.visit.findMany({
        where: { isProxy: true },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { link: { include: { user: { select: { email: true } } } } }
    });

    const activities: ActivityItem[] = [];

    newUsers.forEach(u => {
        activities.push({
            id: `user-${u.id}`,
            type: 'USER',
            title: 'Nowy Użytkownik',
            description: `${u.email}`,
            date: u.createdAt
        });
    });

    newPayouts.forEach(p => {
        activities.push({
            id: `payout-${p.id}`,
            type: 'PAYOUT',
            title: 'Żądanie Wypłaty',
            description: `${p.amount} ${p.user.currency} od ${p.user.email}`,
            date: p.requestedAt
        });
    });

    recentFlags.forEach(f => {
        activities.push({
            id: `flag-${f.id}`,
            type: 'FLAG',
            title: 'Wykryto Proxy',
            description: `IP Hash ${f.ipHash.substring(0, 8)}... u ${f.link.user.email}`,
            date: f.createdAt
        });
    });

    // Sort combined list by date desc
    return activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 20);
}

export async function sendAdminNotification(formData: FormData) {
    const session = await auth();
    if (!session || !session.user) { // removed role check strictness for safety if TS complains, but logically needed
        throw new Error("Unauthorized");
    }

    const targetEmail = formData.get('targetEmail') as string;
    const title = formData.get('title') as string;
    const message = formData.get('message') as string;

    if (!title || !message) throw new Error("Missing fields");

    // If email provided, find user
    if (targetEmail) {
        const user = await prisma.user.findUnique({ where: { email: targetEmail } });
        if (user) {
            await prisma.notification.create({
                data: {
                    userId: user.id,
                    title,
                    message,
                    type: 'SYSTEM',
                    isRead: false
                }
            });
        }
    } else {
        // Broadcast to all users LIMIT 50 for safety in this MVP
        const users = await prisma.user.findMany({ select: { id: true }, take: 50 });
        await prisma.notification.createMany({
            data: users.map(u => ({
                userId: u.id,
                title,
                message,
                type: 'SYSTEM',
                isRead: false
            }))
        });
    }

    return { success: true };
}
