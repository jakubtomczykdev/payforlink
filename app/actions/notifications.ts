'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getNotifications() {
    const session = await auth();
    if (!session || !session.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    });

    if (!user) throw new Error("User not found");

    return prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 20 // Limit to last 20
    });
}

export async function markAsRead(notificationId: string) {
    const session = await auth();
    if (!session || !session.user?.email) return;

    // Verify ownership
    const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
        include: { user: true }
    });

    if (!notification || notification.user.email !== session.user.email) return;

    await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
    });

    revalidatePath('/dashboard');
}

export async function markAllAsRead() {
    const session = await auth();
    if (!session || !session.user?.email) return;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    });

    if (!user) return;

    await prisma.notification.updateMany({
        where: { userId: user.id, isRead: false },
        data: { isRead: true }
    });

    revalidatePath('/dashboard');
}

// Internal helper, not exported as an action to client directly
export async function createNotification(userId: string, title: string, message: string, type: 'SYSTEM' | 'BONUS' | 'OFFER' | 'PAYOUT') {
    await prisma.notification.create({
        data: {
            userId,
            title,
            message,
            type,
            isRead: false
        }
    });
}
