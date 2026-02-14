'use client';

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { claimReward } from "@/app/actions/rewards";
import { Loader2, X } from "lucide-react";

export function ClaimRewardButton({ reward }: { reward: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Use a portal to escape the GlassCard stacking context/clipping
    const [mounted, setMounted] = useState(false);

    // Ensure we only render portal on client
    useEffect(() => {
        setMounted(true);
    }, []);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            await claimReward(formData);
            setIsOpen(false);
        } catch (e: any) {
            alert(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98] text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
                <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                ODBIERZ NAGRODĘ
            </button>
        );
    }

    // Portal Content - Styled to match new premium design
    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#0c0c0e] border border-white/10 w-full max-w-lg rounded-3xl p-8 relative shadow-2xl overflow-y-auto max-h-[90vh] ring-1 ring-white/5">
                {/* Background decorative glow */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-5 top-5 text-zinc-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10 z-20"
                >
                    <X size={20} />
                </button>

                <div className="relative z-10">
                    <div className="mb-6">
                        <div className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-2">Gratulacje!</div>
                        <h2 className="text-3xl font-black text-white mb-2">Odbierz {reward.name}</h2>
                        <p className="text-zinc-400">Zasłużyłeś na to. Podaj dane do wysyłki, a my zajmiemy się resztą.</p>
                    </div>

                    <form action={handleSubmit} className="space-y-5">
                        <input type="hidden" name="rewardId" value={reward.id} />

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Imię i Nazwisko</label>
                            <input
                                name="name"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-700 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all"
                                placeholder="Np. Jan Kowalski"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Adres Wysyłki</label>
                            <textarea
                                name="address"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-700 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all h-28 resize-none"
                                placeholder="Ulica i numer&#10;Kod pocztowy, Miasto&#10;Kraj"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Numer Telefonu</label>
                                <input
                                    name="phone"
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-700 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all"
                                    placeholder="+48 000 000 000"
                                />
                            </div>

                            {(reward.slug.includes('tshirt') || reward.slug.includes('hoodie')) && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Rozmiar</label>
                                    <div className="relative">
                                        <select
                                            name="size"
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="S">S - Mały</option>
                                            <option value="M">M - Średni</option>
                                            <option value="L">L - Duży</option>
                                            <option value="XL">XL - Bardzo Duży</option>
                                            <option value="XXL">XXL</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-emerald-900/20 mt-6 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : 'POTWIERDŹ ODBIÓR NAGRODY'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

    // Render portal if mounted
    if (mounted) {
        return createPortal(modalContent, document.body);
    }

    return null;
}
