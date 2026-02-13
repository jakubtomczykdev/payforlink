"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const CTA = () => {
    return (
        <section className="py-24 bg-[#0B0B0B] relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-3xl p-12 md:p-20 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>

                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight relative z-10">
                        Pieniądze leżą <br />
                        <span className="text-emerald-500">w Twoich linkach.</span>
                    </h2>
                    <p className="text-zinc-400 text-xl mb-12 max-w-2xl mx-auto relative z-10">
                        Nie pozwól im przepadać. Dołącz do elity twórców, którzy znają wartość swojego ruchu.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <Link
                            href="/register"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold px-10 py-4 rounded-xl shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.6)] transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            Odbierz darmowy dostęp
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                    <p className="mt-6 text-sm text-zinc-600 relative z-10">
                        Rejestracja trwa 30 sekund. Brak wymagań wstępnych.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
