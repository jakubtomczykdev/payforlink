"use client";

import { BentoCard } from "@/components/dashboard/BentoCard";
import { Wallet } from "lucide-react";
import { motion } from "framer-motion";

interface WalletWidgetProps {
    balance: number;
    currency: string;
}

export function WalletWidget({ balance, currency }: WalletWidgetProps) {
    return (
        <BentoCard className="flex items-center justify-between p-4" noPadding>
            <div className="flex items-center gap-3 p-4 w-full">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <Wallet className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex-1">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Stan Portfela</div>
                    <div className="flex items-baseline gap-1">
                        <motion.span
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            key={balance}
                            className="text-2xl font-bold text-white tracking-tight"
                        >
                            {balance.toFixed(2)}
                        </motion.span>
                        <span className="text-sm font-semibold text-emerald-500">{currency}</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-zinc-500 font-medium">Następna Wypłata</div>
                    <div className="text-xs font-bold text-white bg-white/5 px-2 py-0.5 rounded border border-white/5 inline-block mt-0.5">Natychmiast</div>
                </div>
            </div>
        </BentoCard>
    );
}
