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
        <BentoCard className="flex flex-col h-[180px] group hover:bg-white/5 transition-colors duration-200" noPadding>
            <div className="flex-1 p-4 md:p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-start z-10">
                    <div className="min-w-0 pr-2">
                        <span className="text-zinc-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider block mb-1 truncate">{title}</span>
                        <div className={`font-bold text-white tracking-tight leading-tight ${value.length > 10 ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl'}`}>{value}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="text-zinc-500 bg-white/5 p-1.5 md:p-2 rounded-lg border border-white/5">
                            {icon}
                        </div>
                        {badge && (
                            <span className="text-[10px] font-medium bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
                                {badge}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col justify-end z-10 mt-auto">
                    {!badge && (
                        <div className="flex flex-col gap-1.5">
                            <span className={`
                                inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded w-fit
                                ${isPositive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : trend === "down" ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-zinc-800 text-zinc-400 border border-white/5'}
                            `}>
                                {trend === "up" && <ArrowUpRight size={14} strokeWidth={2.5} />}
                                {trend === "down" && <ArrowDownRight size={14} strokeWidth={2.5} />}
                                {trend === "neutral" && <Minus size={14} strokeWidth={2.5} />}
                                {trendValue}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-medium">vs poprzedni miesiąc</span>
                        </div>
                    )}

                    {/* Optional Sparkline or decoration could go here */}
                </div>
            </div>
        </BentoCard>
    );
}
