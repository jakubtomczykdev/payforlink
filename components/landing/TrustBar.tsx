"use client";

import { motion } from "framer-motion";
import { Youtube, Twitch, Twitter, Instagram } from "lucide-react";

const platforms = [
    { name: "YouTube", icon: Youtube },
    { name: "Twitch", icon: Twitch },
    { name: "Twitter / X", icon: Twitter },
    { name: "Instagram", icon: Instagram },
    { name: "TikTok", icon: null, label: "TikTok" }, // Lucide doesn't have TikTok yet
];

export const TrustBar = () => {
    return (
        <section className="py-12 border-b border-white/5 bg-transparent relative z-10">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm text-zinc-600 font-medium uppercase tracking-widest mb-8">
                    Zaufali nam twórcy z największych platform
                </p>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 mb-12">
                    {platforms.map((platform, i) => (
                        <div key={i} className="flex items-center gap-3 text-white">
                            {platform.icon && <platform.icon size={28} />}
                            <span className="text-xl font-bold">{platform.label || platform.name}</span>
                        </div>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="border-t border-white/5 pt-8 flex flex-wrap justify-center gap-8 text-sm text-zinc-500 font-mono">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Verified Payouts
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-emerald-500">🔒</span>
                        SSL Secured
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-emerald-500">🛡️</span>
                        Anti-Adblock Tech
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-emerald-500">⚡</span>
                        Daily Withdrawals
                    </div>
                </div>
            </div>
        </section>
    );
};
