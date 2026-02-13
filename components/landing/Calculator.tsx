"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator as CalculatorIcon, DollarSign, MousePointer2 } from "lucide-react";

export const Calculator = () => {
    const [views, setViews] = useState(1000);
    const cpm = 10; // Example CPM in PLN

    const earnings = ((views / 1000) * cpm).toFixed(2);

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400 mb-4">
                        Oblicz swój potencjał
                    </h2>
                    <p className="text-zinc-400">
                        Oszacuj swoje zarobki na podstawie spodziewanego ruchu.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-zinc-900 border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-sm"
                >
                    <div className="flex flex-col md:flex-row gap-12 items-center">

                        {/* Slider Section */}
                        <div className="w-full md:w-1/2 space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-zinc-300 font-medium flex items-center gap-2">
                                        <MousePointer2 className="w-4 h-4 text-emerald-500" />
                                        Ile masz wyświetleń dziennie?
                                    </label>
                                    <span className="text-emerald-400 font-bold font-mono">
                                        {views.toLocaleString()}
                                    </span>
                                </div>

                                <input
                                    type="range"
                                    min="100"
                                    max="50000"
                                    step="100"
                                    value={views}
                                    onChange={(e) => setViews(parseInt(e.target.value))}
                                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-colors"
                                />
                                <div className="flex justify-between text-xs text-zinc-500 font-mono">
                                    <span>100</span>
                                    <span>50k+</span>
                                </div>
                            </div>

                            <div className="p-4 bg-zinc-950/50 rounded-lg border border-white/5 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-zinc-400 mb-1">Średni CPM</p>
                                    <p className="text-lg font-bold text-white">~ {cpm} PLN</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-zinc-500">Stawki Premium</p>
                                    <p className="text-xs text-emerald-500">Tier 1 Traffic</p>
                                </div>
                            </div>
                        </div>

                        {/* Result Section */}
                        <div className="w-full md:w-1/2 text-center md:text-left">
                            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-emerald-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="relative z-10">
                                    <p className="text-zinc-400 font-medium mb-2 flex items-center justify-center md:justify-start gap-2">
                                        <DollarSign className="w-4 h-4 text-emerald-500" />
                                        Twój potencjalny miesięczny zarobek
                                    </p>
                                    <div className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-2">
                                        {((views * 30 * cpm) / 1000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}<span className="text-2xl text-emerald-500 ml-2">PLN</span>
                                    </div>
                                    <p className="text-sm text-emerald-400/80">
                                        * Prognoza przy założeniu stałego ruchu przez 30 dni
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
};
