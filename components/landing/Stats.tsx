"use client";

import { motion } from "framer-motion";
import { Wallet, CreditCard, Building2, Bitcoin } from "lucide-react";

// Simplified stats to prevent render crash
const stats = [
    { label: "Skróconych Linków", value: "1,000,000+" },
    { label: "Wypłacono Użytkownikom", value: "50,000 PLN+" },
    { label: "Zadowolonych Partnerów", value: "10,000+" },
];

export const Stats = () => {
    return (
        <section className="py-20 border-y border-white/5 bg-black/40 backdrop-blur-sm relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors"
                        >
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                                {stat.value}
                            </div>
                            <div className="text-sm font-medium text-zinc-400 uppercase tracking-widest">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust / Payment Methods */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-center justify-center"
                >
                    <p className="text-zinc-500 text-sm mb-8 uppercase tracking-widest font-medium">Gwarantowane Wypłaty Przez</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        <div className="flex items-center gap-2 group">
                            <Wallet className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xl font-semibold text-white">PayPal</span>
                        </div>
                        <div className="flex items-center gap-2 group">
                            <Building2 className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xl font-semibold text-white">Bank Transfer</span>
                        </div>
                        <div className="flex items-center gap-2 group">
                            <Bitcoin className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xl font-semibold text-white">Bitcoin</span>
                        </div>
                        <div className="flex items-center gap-2 group">
                            <CreditCard className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xl font-semibold text-white">WebMoney</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
