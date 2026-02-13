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
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:scale-[1.02]"
            >
                ODBIERZ NAGRODĘ
            </button>
        );
    }

    // Portal Content
    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#09090B] border border-gray-800 w-full max-w-lg rounded-2xl p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors p-1"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-1">Odbierz {reward.name}</h2>
                <p className="text-sm text-gray-400 mb-8">Proszę podać dane do wysyłki.</p>

                <form action={handleSubmit} className="space-y-6">
                    <input type="hidden" name="rewardId" value={reward.id} />

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Imię i Nazwisko</label>
                        <input
                            name="name"
                            required
                            className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
                            placeholder="Jan Kowalski"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Adres Wysyłki</label>
                        <textarea
                            name="address"
                            required
                            className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors h-28 resize-none"
                            placeholder="Ulica, Miasto, Kod Pocztowy, Kraj"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Numer Telefonu</label>
                            <input
                                name="phone"
                                required
                                className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
                                placeholder="+48 ..."
                            />
                        </div>

                        {(reward.slug.includes('tshirt') || reward.slug.includes('hoodie')) && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rozmiar</label>
                                <select
                                    name="size"
                                    className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="S">Mały (S)</option>
                                    <option value="M">Średni (M)</option>
                                    <option value="L">Duży (L)</option>
                                    <option value="XL">Bardzo Duży (XL)</option>
                                    <option value="XXL">XXL</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg shadow-lg shadow-emerald-500/20 mt-4 flex items-center justify-center gap-2 transition-all"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'POTWIERDŹ I WYŚLIJ'}
                    </button>
                </form>
            </div>
        </div>
    );

    // Render portal if mounted
    if (mounted) {
        return createPortal(modalContent, document.body);
    }

    return null;
}
