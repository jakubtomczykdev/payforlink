"use client";

import { motion } from "framer-motion";
import { TrendingUp, User, Shield, Globe, Award, Zap } from "lucide-react";

const earners = [
    { rank: 1, name: "Marek***PL", earnings: "14,250 PLN", trend: "+18%" },
    { rank: 2, name: "Krypto***X", earnings: "11,280 PLN", trend: "+12%" },
    { rank: 3, name: "Anna***Blog", earnings: "9,150 PLN", trend: "+8%" },
    { rank: 4, name: "Game***Pro", earnings: "8,840 PLN", trend: "+25%" },
    { rank: 5, name: "Tech***News", earnings: "7,920 PLN", trend: "+5%" },
];

const partners = [
    { name: "AdTech Global", icon: Globe },
    { name: "SecurePay", icon: Shield },
    { name: "TopAffiliates", icon: Award },
    { name: "ViralMedia", icon: Zap },
];

export const SocialProof = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">

                {/* Trusted By Strip */}
                <div className="text-center mb-20 border-b border-white/5 pb-12">
                    <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold mb-8">
                        Zaufało nam ponad 10 000 twórców i sieci
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        {partners.map((partner, i) => (
                            <div key={i} className="flex items-center gap-2 text-zinc-300 font-bold text-xl">
                                <partner.icon size={24} className="text-emerald-500" />
                                {partner.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
                            <TrendingUp className="w-4 h-4" />
                            <span>Wypłaty Realizowane Codziennie</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Najlepsi Wydawcy w tym Tygodniu
                        </h2>
                        <p className="text-zinc-400">
                            Dołącz do platformy, która stawia Twoje zarobki na pierwszym miejscu.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/5">
                                        <th className="p-6 text-zinc-400 font-medium text-xs uppercase tracking-wider">Pozycja</th>
                                        <th className="p-6 text-zinc-400 font-medium text-xs uppercase tracking-wider">Wydawca</th>
                                        <th className="p-6 text-zinc-400 font-medium text-xs uppercase tracking-wider text-right">Ostatnia Wypłata</th>
                                        <th className="p-6 text-zinc-400 font-medium text-xs uppercase tracking-wider text-right hidden md:table-cell">Wzrost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {earners.map((earner, i) => (
                                        <tr key={i} className="group hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0 font-mono text-sm">
                                            <td className="p-6">
                                                <span className={`
                                            w-8 h-8 flex items-center justify-center rounded-lg font-bold
                                            ${i === 0 ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]' :
                                                        i === 1 ? 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20' :
                                                            i === 2 ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'text-zinc-600'}
                                        `}>
                                                    {earner.rank}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center border border-white/5">
                                                        <User className="w-4 h-4 text-zinc-400" />
                                                    </div>
                                                    <span className="text-zinc-200 font-medium">{earner.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <span className="text-emerald-400 font-bold">{earner.earnings}</span>
                                            </td>
                                            <td className="p-6 text-right hidden md:table-cell">
                                                <span className="text-emerald-500 text-xs bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                                    {earner.trend}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </motion.div>
                </div>

            </div>
        </section>
    );
};
