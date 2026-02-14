"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calculator, DollarSign, TrendingUp, Users, Wallet, Check } from "lucide-react";

export function ProfitCalculator() {
    // State
    const [traffic, setTraffic] = useState(10000); // Monthly visits
    const [conversionRate, setConversionRate] = useState(5.0); // %
    const [cpaNetwork, setCpaNetwork] = useState(2.50); // PLN we get
    const [cpaUser, setCpaUser] = useState(0.01); // PLN we pay per unique click (CPM model) OR per conversion if CPA

    const [isCpmModel, setIsCpmModel] = useState(true); // Default to our current CPM model

    const [fixedCosts, setFixedCosts] = useState(500); // Servers etc
    const [rewardCosts, setRewardCosts] = useState(200); // Merch buffer

    // Calculations
    const uniqueVisits = traffic * 0.8; // Assume 80% unique
    const conversions = (uniqueVisits * conversionRate) / 100;

    const revenue = conversions * cpaNetwork;

    // Cost Logic
    const userPayouts = isCpmModel
        ? uniqueVisits * cpaUser // 0.01 PLN per unique
        : conversions * cpaUser; // If we switched to CPA sharing

    const grossProfit = revenue - userPayouts;
    const netProfit = grossProfit - fixedCosts - rewardCosts;
    const marginPercent = revenue > 0 ? (netProfit / revenue) * 100 : 0; // Avoid NaN

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-6">
                <GlassCard className="p-6 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                            <Calculator size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white tracking-tight">Parametry Symulacji</h2>
                            <p className="text-xs text-zinc-500">Dostosuj wartości wejściowe</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Model Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-medium text-zinc-300">Model Rozliczeń</Label>
                                <p className="text-[10px] text-zinc-500 leading-tight pr-4">
                                    {isCpmModel ? "Płacimy za każde unikalne kliknięcie (CPM)" : "Płacimy procent od konwersji (CPA)"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 bg-black/20 p-1 rounded-lg border border-white/5">
                                <button
                                    onClick={() => setIsCpmModel(false)}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${!isCpmModel ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    CPA
                                </button>
                                <button
                                    onClick={() => setIsCpmModel(true)}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${isCpmModel ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    CPM
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Ruch Miesięczny</Label>
                                <span className="text-xs font-mono text-emerald-500">{traffic.toLocaleString()} wizyt</span>
                            </div>
                            <input
                                type="range"
                                min="1000" max="1000000" step="1000"
                                value={traffic}
                                onChange={(e) => setTraffic(Number(e.target.value))}
                                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs">Konwersja CPA (%)</Label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={conversionRate}
                                    onChange={(e) => setConversionRate(Number(e.target.value))}
                                    className="bg-black/20 border-white/10 text-white h-9"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs">Stawka Sieci (PLN)</Label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={cpaNetwork}
                                    onChange={(e) => setCpaNetwork(Number(e.target.value))}
                                    className="bg-black/20 border-white/10 text-white h-9"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400 text-xs">Koszt Użytkownika ({isCpmModel ? 'CPM' : 'CPA'})</Label>
                            <Input
                                type="number"
                                step={isCpmModel ? "0.01" : "0.1"}
                                value={cpaUser}
                                onChange={(e) => setCpaUser(Number(e.target.value))}
                                className="bg-black/20 border-white/10 text-white h-9"
                            />
                            <p className="text-[10px] text-zinc-600">
                                {isCpmModel ? "Stawka za 1 unikalne wejście" : "Stawka za 1 konwersję (lead)"}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs">Koszty Stałe</Label>
                                <Input
                                    type="number"
                                    value={fixedCosts}
                                    onChange={(e) => setFixedCosts(Number(e.target.value))}
                                    className="bg-black/20 border-white/10 text-white h-9"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs">Budżet Nagród</Label>
                                <Input
                                    type="number"
                                    value={rewardCosts}
                                    onChange={(e) => setRewardCosts(Number(e.target.value))}
                                    className="bg-black/20 border-white/10 text-white h-9"
                                />
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>

            <div className="lg:col-span-7 space-y-6">
                <GlassCard gradient className="p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

                    <div className="relative z-10">
                        <div className="text-xs text-emerald-300 font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                            <TrendingUp size={14} /> Szacowany Zysk Netto
                        </div>
                        <div className={`text-6xl font-black tracking-tighter ${netProfit >= 0 ? 'text-white' : 'text-red-500'}`}>
                            {netProfit.toFixed(2)} <span className="text-2xl text-emerald-500 font-normal">PLN</span>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-6">
                            <div className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${marginPercent > 20 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                Marża: {marginPercent.toFixed(1)}%
                            </div>
                            <div className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                ROI: {((netProfit / (fixedCosts + rewardCosts + userPayouts)) * 100).toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <div className="grid grid-cols-2 gap-4">
                    <GlassCard className="p-5">
                        <div className="flex items-center gap-2 mb-3 text-zinc-400">
                            <Wallet size={16} />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Przychód (Network)</span>
                        </div>
                        <div className="text-2xl font-bold text-white tracking-tight">{revenue.toFixed(2)} PLN</div>
                        <div className="text-xs text-zinc-500 mt-1 font-mono">{conversions.toFixed(0)} konwersji</div>
                    </GlassCard>

                    <GlassCard className="p-5">
                        <div className="flex items-center gap-2 mb-3 text-zinc-400">
                            <Users size={16} />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Wypłaty (Users)</span>
                        </div>
                        <div className="text-2xl font-bold text-white tracking-tight">{userPayouts.toFixed(2)} PLN</div>
                        <div className="text-xs text-zinc-500 mt-1 font-mono">Stawka: {cpaUser} PLN</div>
                    </GlassCard>
                </div>

                <GlassCard className="p-6 border-l-4 border-l-blue-500/50">
                    <div className="flex items-start gap-4">
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mt-1 shrink-0">
                            <Check size={16} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-2">Analiza Progu Rentowności</h4>
                            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                                Aby pokryć koszty stałe i operacyjne ({fixedCosts + rewardCosts} PLN), potrzebujesz wygenerować minimalny ruch na poziomie:
                            </p>
                            <div className="text-xl font-mono font-bold text-blue-400">
                                {Math.ceil((fixedCosts + rewardCosts) / (cpaNetwork * (conversionRate / 100) - cpaUser * (isCpmModel ? 0.8 : (conversionRate / 100)))).toLocaleString()} <span className="text-sm text-zinc-500 font-sans font-medium">wizyt</span>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
