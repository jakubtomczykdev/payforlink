"use client";

import { motion } from "framer-motion";
import { Map, BarChart2, PieChart, Activity } from "lucide-react";

export const AnalyticsPreview = () => {
    return (
        <section className="py-24 bg-transparent overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                            <Activity className="w-4 h-4" />
                            <span>Transparentność 100%</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Pełna kontrola nad <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
                                Twoimi danymi.
                            </span>
                        </h2>
                        <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                            Nasz panel analityczny daje Ci wgląd w każde kliknięcie. Analizuj ruch według kraju, urządzenia i źródła w czasie rzeczywistym.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5 shrink-0">
                                    <Map className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Geolokalizacja</h4>
                                    <p className="text-sm text-zinc-500">Szczegółowa mapa aktywności użytkowników z podziałem na regiony.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5 shrink-0">
                                    <BarChart2 className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Wzrost Przychodu</h4>
                                    <p className="text-sm text-zinc-500">Śledź swoje zarobki dzień po dniu i optymalizuj strategie.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visual Mockup */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full" />

                        <div className="relative bg-[#09090b]/80 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-6 overflow-hidden">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                                <h3 className="text-white font-bold flex items-center gap-2">
                                    <BarChart2 className="w-5 h-5 text-emerald-500" /> Analityka Ruchu
                                </h3>
                                <div className="flex gap-2">
                                    <div className="px-3 py-1 rounded bg-zinc-800 text-xs text-zinc-400">Dzisiaj</div>
                                    <div className="px-3 py-1 rounded bg-white/10 text-xs text-white">7 Dni</div>
                                </div>
                            </div>

                            {/* Charts Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="col-span-2 bg-zinc-900/50 rounded-lg p-4 border border-white/5 h-48 relative flex items-end justify-between px-2 gap-1">
                                    {/* Fake Bar Chart */}
                                    {[20, 40, 30, 50, 45, 60, 55, 70, 65, 80, 75, 90].map((h, i) => (
                                        <div key={i} className="w-full bg-emerald-500/20 rounded-t-sm relative group hover:bg-emerald-500/40 transition-colors" style={{ height: `${h}%` }}></div>
                                    ))}
                                    <div className="absolute top-2 left-4 text-xs text-zinc-500">Kliknięcia / h</div>
                                </div>
                                <div className="col-span-1 bg-zinc-900/50 rounded-lg p-4 border border-white/5 h-48 flex items-center justify-center relative">
                                    {/* Fake Donut Chart */}
                                    <div className="w-24 h-24 rounded-full border-8 border-zinc-800 border-r-emerald-500 border-t-emerald-600 rotate-45"></div>
                                    <div className="absolute text-center">
                                        <div className="text-xl font-bold text-white">84%</div>
                                        <div className="text-[10px] text-zinc-500">Mobile</div>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="bg-zinc-900/50 rounded-lg p-4 border border-white/5 h-40 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px]"></div>
                                <Map className="w-12 h-12 text-zinc-700" />
                                <div className="absolute bottom-4 right-4 flex gap-4 text-xs text-zinc-400">
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> USA (40%)</div>
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-600"></div> PL (25%)</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
