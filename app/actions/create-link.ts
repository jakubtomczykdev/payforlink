'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const createLinkSchema = z.object({
    url: z.string().url({ message: "Invalid URL format" }),
});

export async function createLink(formData: FormData) {
    const session = await auth();
    if (!session || !session.user?.email) {
        return { error: 'Unauthorized' };
    }

    const rawUrl = formData.get('url') as string;
    const validation = createLinkSchema.safeParse({ url: rawUrl });

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors.url?.[0] || 'Invalid URL' };
    }

    const originalUrl = validation.data.url;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) {
        return { error: 'User not found' };
    }

    const shortCode = nanoid(7); // Generate 7 char ID

    // 1. Save to Database
    await prisma.link.create({
        data: {
            originalUrl,
            shortCode,
            userId: user.id,
            monetizationMode: (formData.get('monetizationMode') as 'STANDARD' | 'PLUS' | 'NSFW') || 'STANDARD',
        }
    });

    // 2. Cache in Redis for fast redirects (Key: link:{shortCode})
    // We store the originalUrl directly
    await redis.set(`link:${shortCode}`, originalUrl);

    revalidatePath('/dashboard');
    redirect('/dashboard');
}
