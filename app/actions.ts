'use server';

import { processClick } from '@/lib/analytics';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

export async function verifyAndRedirect(shortCode: string) {
    const headings = await headers();
    const ip = headings.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = headings.get('user-agent') || 'Unknown';

    const headingsObj: Record<string, string> = {};
    headings.forEach((val, key) => { headingsObj[key] = val });

    // 1. Process Logic (Earnings)
    await processClick(shortCode, ip, userAgent, headingsObj);

    // 2. Get Destination (Redis first)
    const cachedUrl = await redis.get<string>(`link:${shortCode}`);
    let originalUrl = cachedUrl;

    if (!originalUrl) {
        // Fallback to DB
        const link = await prisma.link.findUnique({
            where: { shortCode },
            select: { originalUrl: true }
        });

        if (!link) {
            redirect('/');
        }
        originalUrl = link.originalUrl;

        // Populate Cache
        if (originalUrl) {
            await redis.set(`link:${shortCode}`, originalUrl);
        }
    }

    if (!originalUrl) {
        redirect('/');
    }

    // 3. Redirect
    redirect(originalUrl);
}

export async function getDestinationUrl(shortCode: string) {
    const headings = await headers();
    const ip = headings.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = headings.get('user-agent') || 'Unknown';

    const headingsObj: Record<string, string> = {};
    headings.forEach((val, key) => { headingsObj[key] = val });

    // 1. Process Logic (Earnings)
    await processClick(shortCode, ip, userAgent, headingsObj);

    // 2. Get Destination (Redis first)
    const cachedUrl = await redis.get<string>(`link:${shortCode}`);
    if (cachedUrl) return cachedUrl;

    // Fallback to DB
    const link = await prisma.link.findUnique({
        where: { shortCode },
        select: { originalUrl: true }
    });

    if (!link) return null;

    // Populate Cache
    if (link.originalUrl) {
        await redis.set(`link:${shortCode}`, link.originalUrl);
    }

    return link.originalUrl;
}

export async function startLockedVisit(shortCode: string) {
    const headings = await headers();
    const ip = headings.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = headings.get('user-agent') || 'Unknown';

    const headingsObj: Record<string, string> = {};
    headings.forEach((val, key) => { headingsObj[key] = val });

    const unlockToken = crypto.randomUUID();

    // Create a visit that is LOCKED (isUnlocked: false)
    // We pass the unlockToken so we can identify this visit later via Postback
    const result = await processClick(shortCode, ip, userAgent, headingsObj, {
        isUnlocked: false,
        unlockToken: unlockToken
    });

    if (result.error) {
        return { success: false, error: result.error };
    }

    return { success: true, unlockToken };
}
