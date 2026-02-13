"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // Import Switch
import { Calculator, DollarSign, TrendingUp, Users, Wallet } from "lucide-react";

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <Calculator className="text-emerald-500" />
                    <h2 className="text-xl font-bold">Parametry Symulacji</h2>
                </div>

                <div className="space-y-4">
                    {/* Model Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="space-y-0.5">
                            <Label className="text-base">Model Rozliczeń Użytkownika</Label>
                            <p className="text-xs text-gray-500">
                                {isCpmModel ? "Płacimy za każde unikalne kliknięcie (CPM)" : "Płacimy procent od konwersji (CPA)"}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${!isCpmModel ? 'text-white' : 'text-gray-500'}`}>CPA</span>
                            <Switch checked={isCpmModel} onCheckedChange={setIsCpmModel} />
                            <span className={`text-xs font-bold ${isCpmModel ? 'text-emerald-500' : 'text-gray-500'}`}>CPM</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Ruch Miesięczny (Wizyty)</Label>
                        <div className="flex gap-4 items-center">
                            <Input
                                type="number"
                                value={traffic}
                                onChange={(e) => setTraffic(Number(e.target.value))}
                                className="bg-black/20 border-white/10"
                            />
                            <input
                                type="range"
                                min="1000" max="1000000" step="1000"
                                value={traffic}
                                onChange={(e) => setTraffic(Number(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Konwersja na Ofercie CPA (%)</Label>
                        <Input
                            type="number"
                            step="0.1"
                            value={conversionRate}
                            onChange={(e) => setConversionRate(Number(e.target.value))}
                            className="bg-black/20 border-white/10"
                        />
                        <p className="text-xs text-gray-500">Ile % unikalnych wizyt kończy się leadem?</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Stawka Sieci (PLN)</Label>
                            <Input
                                type="number"
                                step="0.1"
                                value={cpaNetwork}
                                onChange={(e) => setCpaNetwork(Number(e.target.value))}
                                className="bg-black/20 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Koszt Użytkownika ({isCpmModel ? 'CPM' : 'CPA'})</Label>
                            <Input
                                type="number"
                                step={isCpmModel ? "0.01" : "0.1"}
                                value={cpaUser}
                                onChange={(e) => setCpaUser(Number(e.target.value))}
                                className="bg-black/20 border-white/10"
                            />
                            <p className="text-[10px] text-gray-500">
                                {isCpmModel ? "Stawka za 1 unikalne wejście" : "Stawka za 1 konwersję (lead)"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div className="space-y-2">
                            <Label>Koszty Stałe (Serwery)</Label>
                            <Input
                                type="number"
                                value={fixedCosts}
                                onChange={(e) => setFixedCosts(Number(e.target.value))}
                                className="bg-black/20 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Budżet na Nagrody</Label>
                            <Input
                                type="number"
                                value={rewardCosts}
                                onChange={(e) => setRewardCosts(Number(e.target.value))}
                                className="bg-black/20 border-white/10"
                            />
                        </div>
                    </div>
                </div>
            </GlassCard>

            <div className="space-y-6">
                <GlassCard gradient className="p-8">
                    <div className="text-sm text-gray-400 font-medium tracking-wider uppercase mb-2">Szacowany Zysk Netto</div>
                    <div className={`text-5xl font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                        {netProfit.toFixed(2)} <span className="text-2xl text-gray-500">PLN</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${marginPercent > 20 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                            Marża: {marginPercent.toFixed(1)}%
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500">
                            ROI: {((netProfit / (fixedCosts + rewardCosts + userPayouts)) * 100).toFixed(1)}%
                        </div>
                    </div>
                </GlassCard>

                <div className="grid grid-cols-2 gap-4">
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-2 mb-2 text-gray-400">
                            <TrendingUp size={16} />
                            <span className="text-xs uppercase font-bold">Przychód (Network)</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{revenue.toFixed(2)} PLN</div>
                        <div className="text-xs text-gray-500 mt-1">{conversions.toFixed(0)} konwersji</div>
                    </GlassCard>

                    <GlassCard className="p-4">
                        <div className="flex items-center gap-2 mb-2 text-gray-400">
                            <Users size={16} />
                            <span className="text-xs uppercase font-bold">Wypłaty (Users)</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{userPayouts.toFixed(2)} PLN</div>
                        <div className="text-xs text-gray-500 mt-1">Stawka: {cpaUser} PLN</div>
                    </GlassCard>
                </div>

                <GlassCard className="p-4">
                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                        <Wallet size={16} />
                        <span className="text-xs uppercase font-bold">Analiza Progu Rentowności</span>
                    </div>
                    <div className="text-sm text-gray-300">
                        Aby wyjść na zero przy obecnych kosztach ({fixedCosts + rewardCosts} PLN), potrzebujesz:
                    </div>
                    <ul className="mt-2 space-y-1 text-sm text-gray-400">
                        <li>• <b>{Math.ceil((fixedCosts + rewardCosts) / (cpaNetwork * (conversionRate / 100) - cpaUser * (isCpmModel ? 0.8 : (conversionRate / 100))))}</b> wizyt (Traffic)</li>
                    </ul>
                </GlassCard>
            </div>
        </div>
    );
}
