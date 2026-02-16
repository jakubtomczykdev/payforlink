import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { notFound } from 'next/navigation';
import ClientInterstitial from './ClientInterstitial';
import { headers, cookies } from 'next/headers';
import { detectProxy } from '@/lib/utils';
import { redirect, RedirectType } from 'next/navigation';

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
    let mode: 'STANDARD' | 'PLUS' | 'NSFW' = 'STANDARD';
    if (!isProxy) {
        if (link.monetizationMode === 'PLUS') mode = 'PLUS';
        else if (link.monetizationMode === 'NSFW') mode = 'NSFW';
    }

    // 4. Prepare CPA URL
    // We'll use a placeholder for click_id (sub1) for the network's internal tracking if needed,
    // or just leave it. MyLead usually sends back sub IDs you pass.
    // sub2 = User ID
    // sub3 = Short Code
    // sub4 = "payforlink" (source identifier)
    // 4. Prepare CPA URL
    let cpaBase = `https://trkio.org/aff_c?offer_id=2691&aff_id=34052`; // Default PLUS offer
    let separator = '&';

    if (mode === 'NSFW') {
        cpaBase = `https://contrack.link/p/6257f5da6c500d58a7144be5/698d0e96ac954811b00213d1`;
        separator = '?';

        // Check for 18+ verification cookie
        const cookieStore = await cookies();
        const isAdultVerified = cookieStore.get('adult-verified');

        if (isAdultVerified) {
            // Redirect to Smartlink if already verified
            // Smartlink: https://www.effectivegatecpm.com/ppkyd2f94z?key=d1d4ac166d22bc2e32a168215cad4dcb
            return redirect('https://www.effectivegatecpm.com/ppkyd2f94z?key=d1d4ac166d22bc2e32a168215cad4dcb', RedirectType.replace);
        }
    }

    const cpaOfferUrl = `${cpaBase}${separator}sub1=${link.user.id}&sub2=${shortCode}`;

    return (
        <ClientInterstitial
            shortCode={shortCode}
            mode={mode}
            cpaOfferUrl={cpaOfferUrl}
        />
    );
}
