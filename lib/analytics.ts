import { redis } from './redis';
import { prisma } from './prisma';

export async function processClick(
    shortCode: string,
    ip: string,
    userAgent: string,
    headers: Record<string, string> = {},
    options: { isUnlocked?: boolean; unlockToken?: string } = {}
) {
    const CPM_RATE = 0.01; // 0.01 PLN per unique click

    // 1. Detect Proxy/VPN (Heuristic)
    // Basic proxy detection - refined for Render/Cloud environments
    const isProxy =
        !!headers['x-proxy-id'] ||
        !!headers['x-vpn'] ||
        !!headers['tor-control'] ||
        headers['user-agent']?.includes('curl') ||
        headers['user-agent']?.includes('python');

    // 2. Mock GeoIP
    const country = headers['x-vercel-ip-country'] || 'PL';
    const city = headers['x-vercel-ip-city'] || 'Warsaw';
    const region = headers['x-vercel-ip-country-region'] || 'MZ';

    // 3. Anti-Fraud: Check if IP has visited this link in the last 24h
    const dedupKey = `click:${shortCode}:${ip}`;
    const hasVisited = await redis.get(dedupKey);
    const isUnique = !hasVisited;

    try {
        const link = await prisma.link.findUnique({
            where: { shortCode },
            select: {
                id: true,
                userId: true,
                isEnabled: true,
                user: { select: { isBanned: true } }
            }
        });

        if (!link || !link.isEnabled) {
            return { unique: false, error: "Link invalid or disabled" };
        }

        // --- FRAUD GUARD START ---
        if (isProxy) {
            const proxyKey = `proxy_count:${link.userId}`;
            const proxyCount = await redis.incr(proxyKey);
            if (proxyCount === 1) await redis.expire(proxyKey, 60 * 60 * 24); // 24h window

            if (proxyCount >= 10 && !link.user.isBanned) {
                await prisma.user.update({
                    where: { id: link.userId },
                    data: { isBanned: true, banReason: "AI: Excessive VPN Traffic (Fraud Detected)" }
                });
                console.warn(`[Fraud Guard] BANNED User ${link.userId} for excessive VPN traffic.`);
            }
        }

        // Low Quality Traffic Check (Low Uniqueness)
        if (!link.user.isBanned) {
            const statsKey = `quality_stats:${link.userId}`;
            const totalVisits = await redis.hincrby(statsKey, 'total', 1);
            const uniqueVisits = isUnique ? await redis.hincrby(statsKey, 'unique', 1) : parseInt((await redis.hget(statsKey, 'unique')) || '0');

            if (totalVisits === 1) await redis.expire(statsKey, 60 * 60 * 24);

            if (totalVisits > 50) {
                const uniquenessRatio = uniqueVisits / totalVisits;
                if (uniquenessRatio < 0.20) {
                    await prisma.user.update({
                        where: { id: link.userId },
                        data: { isBanned: true, banReason: "AI: Extremely Low Quality Traffic (<20% Unique). Contact Support." }
                    });
                    console.warn(`[Fraud Guard] BANNED User ${link.userId} for Low Quality (${(uniquenessRatio * 100).toFixed(1)}%).`);
                }
            }
        }
        // --- FRAUD GUARD END ---

        // NEW: If the visit is locked, we typically DO NOT count earnings yet?
        // Or we count them but they are "pending"? 
        // For simplicity, let's process earnings as usual if unique. The lock is just for access.
        // If the user never unlocks, we basically paid for a visit they didn't see. 
        // Ideally, we should only pay on unlock. 
        // But 'processClick' is designed for "click" payment. 
        // Let's assume for now we pay on CLICK, but restrict ACCESS. 
        // We can refine this later to pay on UNLOCK if needed. 
        // Given the short script, let's keep paying on click for now to avoid breaking stats logic.

        // Actually, if we use `isUnlocked: false`, maybe we should NOT Monetize?
        // Let's use `options.isUnlocked` to determine `isMonetized` logic if needed.
        // But for now, let's stick to the plan: Pay on click, lock access.

        const visitId = crypto.randomUUID();

        const queries: any[] = [
            // 1. Always Log the Visit (Raw Traffic)
            prisma.visit.create({
                data: {
                    id: visitId,
                    linkId: link.id,
                    ipHash: ip,
                    userAgent,
                    isMonetized: isUnique && !link.user.isBanned, // Only monetize if unique and not banned
                    isProxy,
                    country,
                    city,
                    region,
                    isUnlocked: options.isUnlocked ?? true,
                    unlockToken: options.unlockToken
                }
            }),
            // 2. Increment Raw Visit Count
            prisma.link.update({
                where: { id: link.id },
                data: {
                    totalVisits: { increment: 1 },
                    earnings: (isUnique && !link.user.isBanned) ? { increment: CPM_RATE } : undefined
                }
            })
        ];

        const canEarn = isUnique && !link.user.isBanned;

        if (canEarn) {
            queries.push(
                prisma.user.update({
                    where: { id: link.userId },
                    data: {
                        walletBalance: { increment: CPM_RATE },
                        lifetimeEarnings: { increment: CPM_RATE }
                    }
                })
            );
            await redis.set(dedupKey, '1', { ex: 60 * 60 * 24 });
        } else if (isUnique) {
            // Mark unique visits even if banned to prevent database spamming from same IP
            await redis.set(dedupKey, '1', { ex: 60 * 60 * 24 });
        }

        await prisma.$transaction(queries);
        return { unique: isUnique, earnings: canEarn ? CPM_RATE : 0, visitId };

    } catch (error) {
        console.error("Failed to process click:", error);
        return { unique: false, error: "Database error" };
    }
}
