"use client";

import { motion } from "framer-motion";
import { Link, Share2, Wallet, ArrowRight } from "lucide-react";

const steps = [
    {
        icon: Link,
        title: "Skróć Link",
        description: "Wklej dowolny adres URL. System automatycznie dobierze reklamy dla Twoich odbiorców.",
        color: "text-zinc-400",
        bgColor: "bg-zinc-900",
    },
    {
        icon: Share2,
        title: "Udostępnij",
        description: "Wrzuć link na social media. Działa na każdym urządzeniu i w każdym kraju.",
        color: "text-zinc-400",
        bgColor: "bg-zinc-900",
    },
    {
        icon: Wallet,
        title: "Wypłać Środki",
        description: "Zarabiaj na każdym kliknięciu. Wypłacaj środki codziennie, bez zbędnych formalności.",
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        highlighted: true
    },
];

export const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 bg-[#0B0B0B] relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                            Zarabianie jeszcze nigdy <br className="hidden md:block" /> nie było tak <span className="text-emerald-500">proste</span>
                        </h2>
                        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto">
                            Trzy proste kroki dzielą Cię od monetyzacji Twoich treści.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center group"
                        >
                            {/* Icon Container */}
                            <div className={`
                                w-20 h-20 rounded-2xl flex items-center justify-center mb-8 relative
                                ${step.bgColor} border border-white/5 transition-all duration-300
                                ${step.highlighted ? "border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "group-hover:border-white/10"}
                            `}>
                                <step.icon className={`w-8 h-8 ${step.color}`} />

                                {/* Step Number */}
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-black border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                                    0{index + 1}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4">
                                {step.title}
                            </h3>
                            <p className="text-zinc-500 leading-relaxed max-w-[280px]">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-20"
                >
                    <a href="/register" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-all hover:gap-3 group">
                        Załóż darmowe konto <ArrowRight className="w-4 h-4" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

