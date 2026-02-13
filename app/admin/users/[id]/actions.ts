'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
    const session = await auth();
    if (!session || !session.user?.email) throw new Error("Unauthorized");

    // In a real app, optimize this to not fetch DB every time if session has role
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true }
    });

    if (user?.role !== UserRole.ADMIN) throw new Error("Forbidden");
    return true;
}

export async function banUser(userId: string) {
    await checkAdmin();
    await prisma.user.update({
        where: { id: userId },
        data: { isBanned: true }
    });
    revalidatePath(`/admin/users/${userId}`);
    revalidatePath(`/admin/users`);
}

export async function unbanUser(userId: string) {
    await checkAdmin();
    await prisma.user.update({
        where: { id: userId },
        data: { isBanned: false }
    });
    revalidatePath(`/admin/users/${userId}`);
    revalidatePath(`/admin/users`);
}

export async function adjustBalance(userId: string, formData: FormData) {
    await checkAdmin();
    const amount = parseFloat(formData.get('amount') as string);
    const reason = formData.get('reason') as string;

    if (isNaN(amount) || amount === 0) return;

    await prisma.$transaction([
        prisma.user.update({
            where: { id: userId },
            data: { walletBalance: { increment: amount } }
        }),
        // Create notification
        prisma.notification.create({
            data: {
                userId,
                title: amount > 0 ? "Otrzymano Bonus" : "Korekta Salda",
                message: `Twój portfel został ${amount > 0 ? 'zasilony' : 'obciążony'} kwotą ${Math.abs(amount).toFixed(2)} PLN. Powód: ${reason || 'Decyzja Administratora'}`,
                type: amount > 0 ? "BONUS" : "SYSTEM",
            }
        })
    ]);

    revalidatePath(`/admin/users/${userId}`);
}
