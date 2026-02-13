"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, BarChart3 } from "lucide-react";

const features = [
    {
        icon: ShieldCheck,
        title: "Pewność zysków (Anti-AdBlock)",
        description: "Odzyskaj 30% przychodów. Nasz system inteligentnie omija blokady reklam, monetyzując każdego użytkownika.",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    },
    {
        icon: Zap,
        title: "Wypłaty na żądanie",
        description: "Twoje pieniądze są Twoje. Wypłacaj środki codziennie na Revolut, PayPal, USDT lub konto bankowe. Minimum tylko 20 PLN.",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    {
        icon: BarChart3,
        title: "Pełna kontrola",
        description: "Śledź każde kliknięcie w czasie rzeczywistym. Analizuj, które linki konwertują najlepiej i optymalizuj swoje zarobki.",
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20"
    }
];

export const Features = () => {
    return (
        <section className="py-24 bg-transparent relative overflow-hidden" id="features">
            {/* Background Ribbons Placeholder */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Dlaczego profesjonaliści <br /> wybierają <span className="text-emerald-500">PayForLink?</span>
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Stworzyliśmy ekosystem, który rozwiązuje główne problemy branży: niskie stawki, opóźnione wypłaty i brak transparentności.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-8 rounded-2xl border ${feature.border} bg-zinc-900/30 backdrop-blur-sm hover:bg-zinc-900/50 transition-all duration-300 group`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-emerald-500/10 text-emerald-500`}>
                                <feature.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
