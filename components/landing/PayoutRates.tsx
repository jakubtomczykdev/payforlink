"use client";

import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Globe2, Smartphone, Monitor, Zap, Wallet, Landmark, Bitcoin } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

// Mock data for rates
const rates = [
    { country: "Stany Zjednoczone", cpm: "40.00 PLN", code: "US", trend: "up" },
    { country: "Wielka Brytania", cpm: "35.00 PLN", code: "GB", trend: "up" },
    { country: "Niemcy", cpm: "30.00 PLN", code: "DE", trend: "stable" },
    { country: "Polska", cpm: "25.00 PLN", code: "PL", trend: "up" },
    { country: "Świat (Tier 1)", cpm: "15.00 PLN", code: "WO", trend: "stable" },
    { country: "Świat (Tier 2)", cpm: "8.00 PLN", code: "WO", trend: "down" },
];

const paymentMethods = [
    { name: "PayPal", icon: Wallet, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { name: "Przelew", icon: Landmark, color: "text-zinc-200", bg: "bg-zinc-500/10", border: "border-zinc-500/20" },
    { name: "Bitcoin", icon: Bitcoin, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { name: "USDT", icon: Zap, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
];

export const PayoutRates = () => {
    const today = format(new Date(), 'd MMMM yyyy', { locale: pl });

    return (
        <section id="payouts" className="py-32 relative overflow-hidden bg-[#0B0B0B]">
            {/* Background Gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Left Column: Copy */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge variant="outline" className="mb-6 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-4 py-1">
                            <Zap className="w-3 h-3 mr-2 fill-current" />
                            Wypłaty Tego Samego Dnia
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            Globalne standardy <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
                                płatności
                            </span>
                        </h2>
                        <p className="text-zinc-400 text-lg md:text-xl mb-10 leading-relaxed max-w-lg">
                            Rozumiemy, że płynność finansowa jest kluczowa. Dlatego oferujemy szeroki wachlarz metod wypłat realizowanych w trybie ekspresowym.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            {paymentMethods.map((method, i) => (
                                <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${method.bg} ${method.border} backdrop-blur-sm`}>
                                    <method.icon className={`w-6 h-6 ${method.color}`} />
                                    <span className="font-semibold text-white">{method.name}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 flex items-start gap-4">
                            <Globe2 className="w-6 h-6 text-indigo-400 mt-1" />
                            <div>
                                <h4 className="font-semibold text-white mb-1">Zasięg Globalny</h4>
                                <p className="text-sm text-zinc-500">Monetyzuj ruch z każdego kraju dzięki zoptymalizowanym stawkom.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Glassmorphic Tables */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        {/* Decorative Blur behind table */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-indigo-500/10 blur-xl rounded-3xl -z-10" />

                        <div className="bg-zinc-900/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
                            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5">
                                <div>
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        Stawki CPM na Żywo
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                    </h3>
                                    <p className="text-xs text-zinc-500">Aktualizacja: {today}</p>
                                </div>
                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    +5% Bonus Aktywny
                                </Badge>
                            </div>

                            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                                <Table>
                                    <TableHeader className="bg-zinc-950/50 sticky top-0 z-10 backdrop-blur-md">
                                        <TableRow className="border-white/5 hover:bg-transparent">
                                            <TableHead className="text-zinc-500 font-medium">Kraj</TableHead>
                                            <TableHead className="text-right text-zinc-500 font-medium">Stawka / 1k</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rates.map((rate, i) => (
                                            <TableRow key={i} className="border-white/5 hover:bg-white/5 transition-colors group">
                                                <TableCell className="font-medium text-zinc-200 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="bg-zinc-800 text-[10px] font-mono p-1 rounded text-zinc-400 w-7 text-center border border-white/5 group-hover:border-white/20 transition-colors">
                                                            {rate.code}
                                                        </span>
                                                        {rate.country}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right py-4">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-emerald-400 font-bold tracking-tight">{rate.cpm}</span>
                                                        {rate.trend === 'up' && <span className="text-[10px] text-emerald-500/70 flex items-center">▲ Trenduje</span>}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="p-4 border-t border-white/5 bg-zinc-950/30 text-center">
                                <p className="text-xs text-zinc-600 mb-4">
                                    * Stawki zależą od jakości ruchu i formatu reklam (Premium/Standard).
                                </p>
                                <a
                                    href="/register"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                                >
                                    Sprawdź swój potencjał <TrendingUp className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
