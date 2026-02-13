"use client";

import { motion } from "framer-motion";
import { Zap, BarChart3, Globe2, ArrowRight } from "lucide-react";

const features = [
    {
        title: "Natychmiastowe Wypłaty",
        description: "Otrzymaj pieniądze natychmiast po zleceniu. Koniec z czekaniem na terminy płatności.",
        icon: Zap,
        className: "md:col-span-1",
        delay: 0.1,
    },
    {
        title: "Statystyki na Żywo",
        description: "Śledź każde kliknięcie, wyświetlenie i konwersję w czasie rzeczywistym dzięki naszemu panelowi.",
        icon: BarChart3,
        className: "md:col-span-1",
        delay: 0.2,
    },
    {
        title: "Zasięg Globalny",
        description: "Monetyzuj ruch z każdego zakątka świata dzięki naszym inteligentnym algorytmom optymalizacji.",
        icon: Globe2,
        className: "md:col-span-2", // Spans full width on medium grids if we had 2 cols, or just a wider card
        delay: 0.3,
    },
];

export const BentoFeatures = () => {
    return (
        <section className="py-24 relative" id="features">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-16 text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400 mb-6">
                        Stworzony dla wydajności
                    </h2>
                    <p className="text-zinc-400 text-lg">
                        Wszystko, czego potrzebujesz, aby zmaksymalizować swoje przychody, zapakowane w piękny interfejs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: feature.delay }}
                            className={`p-8 rounded-2xl border border-white/5 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors group backdrop-blur-sm ${feature.className === 'md:col-span-2' ? 'md:col-span-2 bg-gradient-to-br from-zinc-900/50 to-emerald-900/10' : ''}`}
                        >
                            <div className="w-12 h-12 rounded-lg bg-zinc-800/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                                <feature.icon className="w-6 h-6 text-emerald-500" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-zinc-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
