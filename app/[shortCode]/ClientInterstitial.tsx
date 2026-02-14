'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { verifyAndRedirect, getDestinationUrl } from '@/app/actions';

interface Props {
    shortCode: string;
    mode: 'STANDARD' | 'PLUS' | 'NSFW';
    cpaOfferUrl: string;
}

export default function ClientInterstitial({ shortCode, mode, cpaOfferUrl }: Props) {
    const [timeLeft, setTimeLeft] = useState(10);
    const [canProceed, setCanProceed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSkip, setShowSkip] = useState(false);
    const [skipTimeLeft, setSkipTimeLeft] = useState(5);
    const [skipActive, setSkipActive] = useState(false);

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        if (skipActive && skipTimeLeft > 0) {
            const timer = setInterval(() => {
                setSkipTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [skipActive, skipTimeLeft]);

    const handleStandardProceed = async () => {
        setIsProcessing(true);
        await verifyAndRedirect(shortCode);
    };

    const handlePlusClaim = async () => {
        setIsProcessing(true);
        // Double Tab Logic
        // 1. Get final URL via server action (processes click/earnings)
        const finalUrl = await getDestinationUrl(shortCode);

        if (finalUrl) {
            // 2. Open Final URL in New Tab
            window.open(finalUrl, '_blank');

            // 3. Redirect Current Tab to CPA Offer
            window.location.href = cpaOfferUrl;
        } else {
            // Error fallback
            alert("Error retrieving link. Please try again.");
            setIsProcessing(false);
        }
    };

    const handleSkip = () => {
        setShowSkip(true);
        setSkipActive(true);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-4 font-sans overflow-hidden">
            {/* MyLead Script Injection for PLUS mode */}
            {mode === 'PLUS' && (
                <>
                    <script dangerouslySetInnerHTML={{ __html: `const adblockRedirect = "https://bestlocker.eu/adblock"` }} />
                    <script type="text/javascript" id="cpljs-dd9f28ce-0921-11f1-aa72-129a1c289511" src="https://bestlocker.eu/iframeLoader/dd9f28ce-0921-11f1-aa72-129a1c289511"></script>
                </>
            )}

            {/* MyLead Script Injection for NSFW mode */}
            {mode === 'NSFW' && (
                <>
                    {/* Placeholder for NSFW Script - Asking user for details */}
                    {/* <script dangerouslySetInnerHTML={{ __html: `const adblockRedirect = "..."` }} /> */}
                    {/* <script type="text/javascript" src="..."></script> */}
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
                        {mode === 'PLUS' ? 'Wykonaj zadanie aby odblokować link...' : mode === 'NSFW' ? 'Potwierdź pełnoletność aby przejść dalej...' : 'Nawiązywanie bezpiecznego połączenia...'}
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

                    {mode === 'NSFW' && (
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
                                    onClick={handlePlusClaim}
                                    disabled={isProcessing}
                                    className="w-full bg-red-600 hover:bg-red-500 text-white font-bold h-12 rounded-xl mt-4 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                                >
                                    {isProcessing ? 'WERYFIKACJA...' : 'POTWIERDZAM 18+ I WCHODZĘ'}
                                </Button>
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
