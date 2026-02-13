"use client";

import { Check, X, Minus } from "lucide-react";

const features = [
    { name: "Stawki CPM (Tier 1)", us: "do 40 PLN", other: "~20 PLN" },
    { name: "Czas Wypłaty", us: "Instant (2h)", other: "30-60 dni" },
    { name: "Minimum do wypłaty", us: "20 PLN", other: "100-200 PLN" },
    { name: "Support 24/7", us: true, other: false },
    { name: "Metody Płatności", us: "PayPal, Krypto, Przelew", other: "Tylko PayPal" },
    { name: "Anti-AdBlock", us: true, other: false },
];

import { DataRibbons } from "./DataRibbons";

export const Comparison = () => {
    return (
        <section className="py-24 bg-transparent relative" id="comparison">
            <DataRibbons />
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Dlaczego <span className="text-emerald-500">PayForLink?</span>
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Zobacz, jak wypadamy na tle konkurencji.
                    </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="p-6 text-zinc-500 font-medium text-sm uppercase tracking-wider w-1/3">Funkcja</th>
                                <th className="p-6 text-white font-bold text-lg bg-emerald-500/10 border-x border-emerald-500/20 w-1/3 text-center relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                                    PayForLink
                                </th>
                                <th className="p-6 text-zinc-400 font-medium text-lg w-1/3 text-center">Inne Sieci</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {features.map((feature, i) => (
                                <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 text-zinc-300 font-medium">{feature.name}</td>

                                    {/* Us */}
                                    <td className="p-6 text-center bg-emerald-500/5 border-x border-emerald-500/10 font-bold text-white">
                                        {typeof feature.us === "boolean" ? (
                                            feature.us ? <Check className="w-6 h-6 text-emerald-500 mx-auto" /> : <X className="w-6 h-6 text-red-500 mx-auto" />
                                        ) : (
                                            <span className="text-emerald-400">{feature.us}</span>
                                        )}
                                    </td>

                                    {/* Others */}
                                    <td className="p-6 text-center text-zinc-500">
                                        {typeof feature.other === "boolean" ? (
                                            feature.other ? <Check className="w-6 h-6 text-zinc-600 mx-auto" /> : <Minus className="w-6 h-6 text-zinc-700 mx-auto" />
                                        ) : (
                                            feature.other
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};
