'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { redirect } from 'next/navigation';

export async function requestPayout(formData: FormData) {
    const session = await auth();
    if (!session || !session.user?.email) {
        return { error: 'Unauthorized' };
    }

    const amount = parseFloat(formData.get('amount') as string);
    const method = formData.get('method') as string;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) {
        return { error: 'User not found' };
    }

    if (user.walletBalance < amount || amount < 20) {
        return { error: 'Insufficient funds or below minimum' };
    }

    // Validation: Check if method details exist
    if (method === 'BANK' && !user.bankAccount) {
        return { error: 'Please set your Bank Account details in Settings.' };
    }
    if (method === 'USDT' && !user.usdtAddress) {
        return { error: 'Please set your USDT Address in Settings.' };
    }
    if (method === 'BLIK' && !user.blikNumber) {
        return { error: 'Please set your BLIK Number in Settings.' };
    }

    try {
        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { walletBalance: { decrement: amount } }
            }),
            prisma.payout.create({
                data: {
                    userId: user.id,
                    amount,
                    status: 'PENDING',
                    method,
                }
            })
        ]);

        revalidatePath('/dashboard/payouts');
    } catch (error) {
        return { error: 'Transaction failed' };
    }

    redirect('/dashboard/payouts');
}
