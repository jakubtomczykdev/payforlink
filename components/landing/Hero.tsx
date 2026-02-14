"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

import { DataRibbons } from "./DataRibbons";

export const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden items-center justify-center bg-transparent" id="hero">
            <DataRibbons />

            {/* Glow Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 text-center">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm mb-8"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm text-emerald-300 font-medium tracking-wide">
                        W ciągu ostatnich 24h wydawcy zarobili <span className="text-white font-bold">124,592 PLN</span>
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] max-w-5xl mx-auto"
                >
                    Twoje linki, Twój kapitał. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
                        Nie pozwól, by Twój ruch się marnował.
                    </span>
                </motion.h1>

                {/* Subheader */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Monetyzacja treści przez inteligentne skracanie linków.
                    Technologia Anti-Adblock, transparentne rozliczenia i natychmiastowe wypłaty.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center mb-16"
                >
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
                        <Link
                            href="/register"
                            className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-2"
                        >
                            Odbierz dostęp do stawek Premium
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#payouts"
                            className="px-8 py-4 text-zinc-300 hover:text-white font-medium transition-colors border border-white/5 hover:border-white/10 rounded-xl bg-white/5 hover:bg-white/10"
                        >
                            Zobacz stawki CPM
                        </Link>
                    </div>
                    <p className="text-sm text-zinc-500 flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        Darmowe konto. Start w mniej niż 30 sekund.
                    </p>
                </motion.div>

                {/* Dashboard Mockup - Constructed with HTML/CSS for perfect control */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="relative max-w-5xl mx-auto"
                >
                    {/* Glow Aura - PULSING EMERALD */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-emerald-500/20 blur-[120px] rounded-full -z-10 animate-pulse" />

                    <div className="rounded-xl bg-[#09090b] border border-white/10 shadow-2xl overflow-hidden relative group">

                        {/* Browser Header */}
                        <div className="h-10 bg-zinc-900/80 border-b border-white/5 flex items-center px-4 gap-2 backdrop-blur-md">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
                            </div>
                            <div className="ml-4 flex-1 max-w-md h-6 bg-zinc-800/50 rounded flex items-center px-3 text-[10px] text-zinc-500 font-mono border border-white/5">
                                pl.payforlink.com/dashboard/overview
                            </div>
                        </div>

                        {/* Dashboard Content */}
                        <div className="p-6 md:p-8 bg-[#0B0B0B] grid gap-6 text-left relative">
                            {/* Grid Background inside mockup */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                            {/* Stats Row */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                                {/* Stat 1 */}
                                <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-xl backdrop-blur-sm">
                                    <div className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1 flex items-center gap-2">
                                        <TrendingUp size={12} className="text-emerald-500" /> Całkowite Zarobki
                                    </div>
                                    <div className="text-2xl font-bold text-white">4 245,50 PLN</div>
                                    <div className="text-[10px] text-emerald-500/80 mt-1 font-mono">+340.00 PLN dzisiaj</div>
                                </div>
                                {/* Stat 2 */}
                                <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-xl backdrop-blur-sm">
                                    <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1 flex items-center gap-2">
                                        <Zap size={12} className="text-emerald-400" /> Aktywne Linki
                                    </div>
                                    <div className="text-2xl font-bold text-white">48</div>
                                    <div className="text-[10px] text-zinc-500 mt-1 font-mono">100% uptime</div>
                                </div>
                                {/* Stat 3 */}
                                <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-xl backdrop-blur-sm">
                                    <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1 flex items-center gap-2">
                                        <ShieldCheck size={12} className="text-emerald-500" /> Wyświetlenia
                                    </div>
                                    <div className="text-2xl font-bold text-white">124 592</div>
                                    <div className="text-[10px] text-zinc-500 mt-1 font-mono">Ostatnie 30 dni</div>
                                </div>
                                {/* Stat 4 */}
                                <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-xl backdrop-blur-sm">
                                    <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1 flex items-center gap-2">
                                        <CheckCircle2 size={12} className="text-emerald-300" /> Średni CPM
                                    </div>
                                    <div className="text-2xl font-bold text-white">34,06 PLN</div>
                                    <div className="text-[10px] text-emerald-500/80 mt-1 font-mono">▲ 4.2% wzrost</div>
                                </div>
                            </div>

                            {/* Chart Area Mockup */}
                            <div className="bg-zinc-900/20 border border-white/5 rounded-xl h-64 p-6 relative z-10 flex items-end gap-2">
                                {[30, 45, 35, 60, 50, 75, 65, 85, 70, 95, 80, 100].map((h, i) => (
                                    <div key={i} className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                        <div className="absolute top-0 w-full h-1 bg-emerald-500/50" />
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded transition-opacity whitespace-nowrap border border-white/10">
                                            {h * 45} Wizyt
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Overlay reflecting on surface */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none mix-blend-overlay" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
