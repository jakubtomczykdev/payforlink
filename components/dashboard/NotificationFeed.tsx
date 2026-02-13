"use client";

import { useState, useEffect } from "react";
import { BentoCard } from "@/components/dashboard/BentoCard";
import { Gift, Info, Check, Bell, MousePointer2 } from "lucide-react";
import { getNotifications } from "@/app/actions/notifications";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string; // Simplified for client usage if enum causes issues
    isRead: boolean;
    createdAt: Date;
}

export function NotificationFeed() {
    const [feed, setFeed] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const data = await getNotifications();
                // Filter only for BONUS and OFFER (and maybe PAYOUT?) as requested "bonusów i ofert"
                const relevant = (data as unknown as Notification[])
                    .filter(n => ['BONUS', 'OFFER'].includes(n.type))
                    .slice(0, 5); // Show last 5
                setFeed(relevant);
            } catch (error) {
                console.error("Failed to fetch notification feed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
        // Poll every 60s
        const interval = setInterval(fetchFeed, 60000);
        return () => clearInterval(interval);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'BONUS': return <Gift size={14} className="text-emerald-500" />;
            case 'OFFER': return <Info size={14} className="text-blue-500" />;
            default: return <Bell size={14} className="text-zinc-500" />;
        }
    };

    return (
        <BentoCard
            className="flex flex-col group hover:bg-[#1f1f1f] transition-all duration-300"
            title="Ostatnie Aktywności"
            action={<div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md border border-white/5 text-[10px] text-zinc-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE
            </div>}
        >
            <div className="flex-1 flex flex-col gap-2 overflow-hidden mt-1">
                {loading ? (
                    <div className="p-4 text-center text-xs text-zinc-600 animate-pulse">Ładowanie...</div>
                ) : feed.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-zinc-600 gap-2">
                        <Gift size={20} className="opacity-20" />
                        <span className="text-xs">Brak nowych bonusów</span>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {feed.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors group/item"
                            >
                                <div className="mt-0.5 w-7 h-7 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover/item:border-white/20 transition-colors">
                                    {getIcon(item.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2 mb-0.5">
                                        <h4 className="text-xs font-semibold text-zinc-200 truncate pr-2">{item.title}</h4>
                                        <span className="text-[9px] text-zinc-600 whitespace-nowrap flex-shrink-0 font-mono">
                                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: pl })}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 leading-relaxed line-clamp-2">
                                        {item.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </BentoCard>
    );
}
