'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { startLockedVisit, verifyAndRedirect, getDestinationUrl } from '@/app/actions';

interface Props {
    shortCode: string;
    mode: 'STANDARD' | 'PLUS' | 'NSFW';
    cpaOfferUrl: string;
}

export default function ClientInterstitial({ shortCode, mode, cpaOfferUrl }: Props) {
    const [timeLeft, setTimeLeft] = useState(10);
    const [canProceed, setCanProceed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLocked, setIsLocked] = useState(false); // For NSFW waiting state
    const [visitToken, setVisitToken] = useState<string | null>(null);

    // Timer Logic
    useEffect(() => {
        if (mode === 'STANDARD') { // Only run timer for STANDARD
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCanProceed(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [mode]);

    const handleStandardProceed = async () => {
        setIsProcessing(true);
        await verifyAndRedirect(shortCode);
    };

    const handlePlusClaim = async () => {
        // Obsolete? PLUS usually works via script injection, but if we have a button:
        // Reuse similar logic or keep existing
        setIsProcessing(true);
        const finalUrl = await getDestinationUrl(shortCode);
        if (finalUrl) {
            window.open(finalUrl, '_blank');
            window.location.href = cpaOfferUrl;
        } else {
            alert("Error retrieving link. Please try again.");
            setIsProcessing(false);
        }
    };

    const handleNSFWClaim = async () => {
        setIsProcessing(true);

        // 1. Create Locked Visit
        const result = await startLockedVisit(shortCode);
        if (!result.success || !result.unlockToken) {
            alert("Błąd inicjalizacji. Spróbuj ponownie.");
            setIsProcessing(false);
            return;
        }

        const token = result.unlockToken;
        setVisitToken(token);

        // 2. Prepare Offer URL with Token (sub3)
        // Check if cpaOfferUrl already has query params
        const separator = cpaOfferUrl.includes('?') ? '&' : '?';
        const offerUrlWithToken = `${cpaOfferUrl}${separator}sub3=${token}`;

        // 3. Open Offer in New Tab
        window.open(offerUrlWithToken, '_blank');

        // 4. Show "Waiting" State & Start Polling
        setIsLocked(true);
        setIsProcessing(false); // Enable polling UI

        // Polling Loop
        const pollInterval = setInterval(async () => {
            try {
                const res = await fetch(`/api/visit/status?token=${token}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.unlocked) {
                        clearInterval(pollInterval);
                        // 5. Redirect to Final URL on Unlock
                        // We need to fetch the final URL again or reuse if we had it (we don't for security, fetching now)
                        // Actually, we can just call verifyAndRedirect or getDestinationUrl.
                        // Since verifyAndRedirect redirects server-side, it might not work well in interval.
                        // Better to fetch URL and redirect client-side.
                        const finalUrl = await getDestinationUrl(shortCode);
                        if (finalUrl) {
                            window.location.href = finalUrl;
                        }
                    }
                }
            } catch (e) {
                console.error("Polling error", e);
            }
        }, 5000); // Check every 5s
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-4 font-sans overflow-hidden">
            {/* MyLead Script Injection for PLUS mode only */}
            {mode === 'PLUS' && (
                <>
                    <script dangerouslySetInnerHTML={{ __html: `const adblockRedirect = "https://bestlocker.eu/adblock"` }} />
                    <script type="text/javascript" id="cpljs-dd9f28ce-0921-11f1-aa72-129a1c289511" src="https://bestlocker.eu/iframeLoader/dd9f28ce-0921-11f1-aa72-129a1c289511"></script>
                </>
            )}

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className={`absolute top-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full blur-[120px] ${mode === 'NSFW' ? 'bg-red-600/10' : 'bg-purple-600/10'}`} />
                <div className={`absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full blur-[120px] ${mode === 'NSFW' ? 'bg-orange-500/10' : 'bg-emerald-500/10'}`} />
            </div>

            {/* Top Ad Placeholder */}
            <div className="w-full max-w-4xl h-32 bg-gray-900/50 rounded-lg border border-gray-800 flex items-center justify-center mb-8 relative z-10 backdrop-blur-sm">
                <span className="text-gray-600 font-mono text-xs tracking-widest">REKLAMA</span>
            </div>

            <div className="bg-[#0A0A0A] border border-gray-800/50 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)] text-center space-y-8 relative z-10 backdrop-blur-xl">

                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {mode === 'PLUS' ? 'Zadanie Specjalne' : mode === 'NSFW' ? 'Treści 18+ (NSFW)' : 'Utrzymaj Pozycję'}
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {isLocked
                            ? 'Oczekiwanie na weryfikację wieku...'
                            : mode === 'PLUS' ? 'Wykonaj zadanie aby odblokować link...' : mode === 'NSFW' ? 'Potwierdź pełnoletność aby przejść dalej...' : 'Nawiązywanie bezpiecznego połączenia...'}
                    </p>
                </div>

                {/* Main Content Area */}
                <div className="min-h-[200px] flex flex-col items-center justify-center relative">

                    {!canProceed && mode === 'STANDARD' && (
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            {/* Neon Ring */}
                            <div className="absolute inset-0 rounded-full border-4 border-gray-800" />
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    className="text-emerald-500 transition-all duration-1000 ease-linear drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                                    strokeWidth="4"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="48"
                                    cx="50"
                                    cy="50"
                                    strokeDasharray="301.59"
                                    strokeDashoffset={301.59 * (1 - timeLeft / 10)}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="text-5xl font-bold text-white font-mono tracking-tighter">
                                {timeLeft}
                            </div>
                        </div>
                    )}

                    {canProceed && mode === 'STANDARD' && (
                        <Button
                            onClick={handleStandardProceed}
                            disabled={isProcessing}
                            className="w-full h-14 text-lg font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] rounded-xl"
                        >
                            {isProcessing ? 'WERYFIKACJA...' : 'POBIERZ LINK'}
                        </Button>
                    )}

                    {mode === 'PLUS' && (
                        <div className="w-full animate-in fade-in zoom-in duration-500">
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                <p className="text-sm text-emerald-400">
                                    Oferty powinny pojawić się na ekranie. Jeśli ich nie widzisz, wyłącz AdBlock.
                                </p>
                            </div>
                        </div>
                    )}

                    {mode === 'NSFW' && !isLocked && (
                        <div className="w-full animate-in fade-in zoom-in duration-500">
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg space-y-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 text-red-500 mb-2">
                                    <span className="font-bold text-lg">18+</span>
                                </div>
                                <p className="text-sm text-red-400 font-bold">
                                    TA STRONA ZAWIERA TREŚCI DLA DOROSŁYCH
                                </p>
                                <p className="text-xs text-red-300/70">
                                    Musisz ukończyć weryfikację wieku (oferta), aby uzyskać dostęp.
                                </p>
                                <Button
                                    onClick={handleNSFWClaim}
                                    disabled={isProcessing}
                                    className="w-full bg-red-600 hover:bg-red-500 text-white font-bold h-12 rounded-xl mt-4 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                                >
                                    {isProcessing ? 'WERYFIKACJA...' : 'POTWIERDZAM 18+ I WCHODZĘ'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {mode === 'NSFW' && isLocked && (
                        <div className="w-full animate-in fade-in zoom-in duration-500 flex flex-col items-center">
                            <div className="relative w-16 h-16 mb-4">
                                <div className="absolute inset-0 rounded-full border-4 border-red-900/30" />
                                <div className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
                            </div>
                            <p className="text-sm text-red-400 font-bold animate-pulse">
                                OCZEKIWANIE NA WERYFIKACJĘ...
                            </p>
                            <p className="text-xs text-gray-500 mt-2 max-w-[200px]">
                                Nie zamykaj tej karty. Po potwierdzeniu pełnoletności (wykonaniu oferty), zostaniesz przekierowany automatycznie.
                            </p>

                            {/* DEBUG HELPER FOR USER */}
                            <div className="mt-8 p-4 bg-black/50 rounded border border-gray-800 text-left w-full overflow-hidden">
                                <p className="text-[10px] text-gray-500 font-mono mb-2">DEBUG / MANUAL TEST LINK:</p>
                                <div className="text-[10px] text-gray-400 font-mono break-all select-all bg-gray-900 p-2 rounded cursor-text">
                                    {(() => {
                                        const userIdMatch = cpaOfferUrl.match(/sub1=([^&]+)/);
                                        const userId = userIdMatch ? userIdMatch[1] : 'UNKNOWN_USER';
                                        return `https://payforlink.onrender.com/api/postback?userId=${userId}&shortCode=${shortCode}&visitToken=${visitToken}&payout=2.50&currency=PLN&status=approved`;
                                    })()}
                                </div>
                                <p className="text-[10px] text-gray-600 mt-1">Skopiuj powyższy link i otwórz w nowej karcie, aby symulować wykonanie zadania.</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Bottom Ad Placeholder */}
            <div className="w-full max-w-lg h-60 bg-gray-900/50 rounded-lg border border-gray-800 flex items-center justify-center mt-8 relative z-10 backdrop-blur-sm">
                <span className="text-gray-600 font-mono text-xs tracking-widest">REKLAMA</span>
            </div>
        </div>
    );
}
