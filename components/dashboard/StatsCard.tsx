"use client";

import { BentoCard } from "@/components/dashboard/BentoCard";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface StatsCardProps {
    title: string;
    value: string;
    description?: string;
    icon: React.ReactNode;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    data?: number[];
    isCurrency?: boolean;
    badge?: string; // New prop for "Instant" or other status badges
}

const generateSparkline = () => Array.from({ length: 15 }, () => Math.floor(Math.random() * 50) + 20);

export function StatsCard({
    title,
    value,
    icon,
    trend = "up",
    trendValue = "+2.4%",
    data,
    badge
}: StatsCardProps) {
    const sparkData = (data || generateSparkline()).map((val, i) => ({ i, val }));
    const isPositive = trend === "up";
    const color = isPositive ? "#10B981" : trend === "down" ? "#EF4444" : "#71717A";

    return (
        <BentoCard className="flex flex-col h-[160px] group hover:bg-white/5 transition-colors duration-200" noPadding>
            <div className="flex-1 p-3 md:p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-start z-10">
                    <div>
                        <span className="text-zinc-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider block mb-1">{title}</span>
                        <div className="text-xl md:text-3xl font-bold text-white tracking-tight">{value}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="text-zinc-500 bg-white/5 p-1.5 md:p-2 rounded-lg border border-white/5">
                            {icon}
                        </div>
                        {badge && (
                            <span className="text-[10px] font-medium bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20">
                                {badge}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-end justify-between z-10 mt-auto">
                    <div className="flex items-center gap-2">
                        {!badge && (
                            <>
                                <span className={`
                                    flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded
                                    ${isPositive ? 'bg-[#10B981]/10 text-[#10B981]' : trend === "down" ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-400'}
                                `}>
                                    {trend === "up" && <ArrowUpRight size={12} strokeWidth={3} />}
                                    {trend === "down" && <ArrowDownRight size={12} strokeWidth={3} />}
                                    {trend === "neutral" && <Minus size={12} strokeWidth={3} />}
                                    {trendValue}
                                </span>
                                <span className="text-[10px] text-zinc-400 font-medium">vs poprzedni miesiąc</span>
                            </>
                        )}
                    </div>

                    <div className="h-10 w-24 absolute bottom-4 right-4 opacity-50 pointer-events-none">

                    </div>
                </div>
            </div>
        </BentoCard>
    );
}
