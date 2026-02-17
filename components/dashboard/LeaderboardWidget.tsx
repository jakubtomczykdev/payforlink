
"use client";

import { BentoCard } from "@/components/dashboard/BentoCard";
import { Trophy } from "lucide-react";

const USERS = [
    { name: "Alex_K", earning: "450.20", avatar: "A", change: "+12%" },
    { name: "Sniper99", earning: "320.50", avatar: "S", change: "+5%" },
    { name: "ProLinker", earning: "210.00", avatar: "P", change: "-2%" },
    { name: "TopG_22", earning: "195.50", avatar: "T", change: "+8%" },
    { name: "Tom_C", earning: "180.80", avatar: "T", change: "+0%" },
    { name: "User882", earning: "150.10", avatar: "U", change: "+1%" },
];

export function LeaderboardWidget() {
    return (
        <BentoCard
            className="h-full flex flex-col group hover:bg-[#1f1f1f] transition-colors"
            title="Najlepsi Zarabiający"
            action={<span className="text-[10px] font-medium text-zinc-500 bg-[#2C2C2C] px-2 py-1 rounded inline-flex items-center">Dzisiaj</span>}
        >
            <div className="w-full text-left border-collapse -mx-4 md:-mx-5 -mb-4 md:-mb-5">
                <div className="flex text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b border-[#2C2C2C] bg-[#1a1a1a]">
                    <div className="py-3 pl-5 w-12">#</div>
                    <div className="py-3 flex-1">Użytkownik</div>
                    <div className="py-3 pr-5 text-right">Przychód</div>
                </div>
                <div className="flex flex-col">
                    {USERS.map((user, i) => (
                        <div key={user.name} className="flex items-center text-sm border-b border-[#2C2C2C] last:border-0 hover:bg-white/5 transition-colors">
                            <div className="py-4 pl-5 w-12 font-medium text-zinc-500">
                                {i < 3 ? (
                                    <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${i === 0 ? 'bg-yellow-500/10 text-yellow-500' :
                                        i === 1 ? 'bg-zinc-400/10 text-zinc-400' :
                                            'bg-orange-700/10 text-orange-600'
                                        }`}>
                                        {i + 1}
                                    </span>
                                ) : (
                                    <span className="pl-1.5">{i + 1}</span>
                                )}
                            </div>
                            <div className="py-4 flex-1 flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#252525] flex items-center justify-center text-[10px] font-bold text-zinc-400 border border-[#2C2C2C]">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="text-zinc-300 font-medium">{user.name}</span>
                            </div>
                            <div className="py-4 pr-5 text-right">
                                <div className="font-mono font-medium text-emerald-500">{user.earning}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </BentoCard>
    );
}
