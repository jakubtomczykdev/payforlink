"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BentoCard } from "@/components/dashboard/BentoCard";
import { Wallet, Landmark, Bitcoin, CreditCard, Activity } from "lucide-react";

const NAMES = ["User123", "MoneyMaker", "CryptoKing", "Anna_K", "FastCash", "ProEarner", "DevOps99", "GamerX"];
const AMOUNTS = ["45.00 PLN", "120.50 PLN", "200.00 PLN", "15.00 PLN", "500.00 PLN", "88.88 PLN"];
const METHODS = [
    { name: "BLIK", icon: <CreditCard className="w-3 h-3 text-red-500" /> },
    { name: "PayPal", icon: <Wallet className="w-3 h-3 text-blue-500" /> },
    { name: "Crypto", icon: <Bitcoin className="w-3 h-3 text-orange-500" /> },
    { name: "Revolut", icon: <Landmark className="w-3 h-3 text-purple-500" /> }
];

export function LivePayoutFeed() {
    const [feed, setFeed] = useState<{ id: number, text: string, amount: string, method: any }[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const name = NAMES[Math.floor(Math.random() * NAMES.length)];
            const amount = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];
            const method = METHODS[Math.floor(Math.random() * METHODS.length)];
            const id = Date.now();

            setFeed(prev => [{
                id,
                text: `${name}`,
                amount: amount,
                method: method
            }, ...prev.slice(0, 4)]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <BentoCard
            className="h-full flex flex-col"
            title="Live Payouts"
            action={<Activity size={12} className="text-emerald-500 animate-pulse" />}
        >
            <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                <AnimatePresence mode={'popLayout'}>
                    {feed.map((item) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={item.id}
                            className="flex items-center justify-between text-xs bg-white/5 p-2 rounded-lg border border-white/5 text-zinc-300 group hover:border-emerald-500/20 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <span className="p-1 bg-white/5 rounded-md border border-white/5">{item.method.icon}</span>
                                <span className="font-medium">{item.text}</span>
                            </div>
                            <span className="font-mono font-bold text-emerald-500">{item.amount}</span>
                        </motion.div>
                    ))}
                    {feed.length === 0 && (
                        <div className="text-center text-xs text-zinc-500 py-4">Waiting for incoming transactions...</div>
                    )}
                </AnimatePresence>
            </div>
        </BentoCard>
    );
}
