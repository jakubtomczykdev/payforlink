"use client";

import { BentoCard } from "@/components/dashboard/BentoCard";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakWidgetProps {
    streak: number;
    weekActivity: { name: string; active: boolean }[];
}

export function StreakWidget({ streak, weekActivity }: StreakWidgetProps) {
    return (
        <BentoCard className="group hover:bg-[#1f1f1f] transition-all duration-300" noPadding>
            <div className="flex flex-col p-5">
                {/* Header: Icon + Text */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                            <Flame size={22} className="text-orange-500 fill-orange-500" />
                        </div>
                        {streak > 0 && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#1a1a1a]" />
                        )}
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white leading-none mb-1">
                            {streak} {streak === 1 ? 'Dzień' : 'Dni'}
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                            Twoja Seria
                        </div>
                    </div>
                </div>

                {/* Week Activity Strip */}
                <div className="flex items-center justify-between bg-black/20 rounded-xl p-3 border border-white/5 mt-4">
                    {weekActivity.map((day, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5">
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all duration-500",
                                day.active
                                    ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] scale-110"
                                    : "bg-zinc-800"
                            )} />
                            <span className={cn(
                                "text-[9px] font-black tracking-tighter",
                                day.active ? "text-orange-500" : "text-zinc-600"
                            )}>
                                {day.name.charAt(0)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </BentoCard>
    );
}
