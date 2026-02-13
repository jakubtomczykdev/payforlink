import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { notFound } from 'next/navigation';
import ClientInterstitial from './ClientInterstitial';
import { headers } from 'next/headers';
import { detectProxy } from '@/lib/utils';

interface Props {
    params: Promise<{
        shortCode: string;
    }>;
}

export default async function Page({ params }: Props) {
    const { shortCode } = await params;
    const headersList = await headers();
    const headingsObj: Record<string, string> = {};
    headersList.forEach((val, key) => { headingsObj[key] = val });

    // 1. Detect Proxy
    const isProxy = detectProxy(headingsObj);

    // 2. Fetch Link & Creator Settings
    // We need to bypass Redis for the *settings* check initially to get the latest mode,
    // OR we cache correctly. For now, let's fetch DB to be safe for this feature.
    const link = await prisma.link.findUnique({
        where: { shortCode, isEnabled: true },
        select: {
            monetizationMode: true,
            user: {
                select: {
                    id: true
                }
            }
        }
    });

    if (!link) {
        return notFound();
    }

    // 3. Determine Mode
    // Default to STANDARD if proxy, otherwise use link's setting (which defaults to STANDARD)
    // If Global User setting is enforcing something, we might check that, but per task "per link" logic:
    const mode = (link.monetizationMode === 'PLUS' && !isProxy) ? 'PLUS' : 'STANDARD';

    // 4. Prepare CPA URL
    // We'll use a placeholder for click_id (sub1) for the network's internal tracking if needed,
    // or just leave it. MyLead usually sends back sub IDs you pass.
    // sub2 = User ID
    // sub3 = Short Code
    // sub4 = "payforlink" (source identifier)
    const cpaBase = `https://trkio.org/aff_c?offer_id=2691&aff_id=34052`;
    const cpaOfferUrl = `${cpaBase}&sub2=${link.user.id}&sub3=${shortCode}&sub4=payforlink`;

    return (
        <ClientInterstitial
            shortCode={shortCode}
            mode={mode}
            cpaOfferUrl={cpaOfferUrl}
        />
    );
}
