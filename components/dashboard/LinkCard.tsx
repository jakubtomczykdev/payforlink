"use client";

import { BentoCard } from "@/components/dashboard/BentoCard";
import { Link2, BarChart2, ExternalLink, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface LinkCardProps {
    link: {
        id: string;
        shortCode: string;
        originalUrl: string;
        totalVisits: number;
        createdAt: Date;
    };
}

export function LinkCard({ link }: LinkCardProps) {
    const [copied, setCopied] = useState(false);

    const fullUrl = `https://payforlink.pl/${link.shortCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
        >
            <BentoCard className="group transition-all duration-300 hover:border-emerald-500/20" noPadding>
                <div className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 overflow-hidden">
                            <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors border border-emerald-500/10">
                                <Link2 className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-zinc-100 truncate max-w-[200px]">/{link.shortCode}</h4>
                                    <button onClick={handleCopy} className="text-zinc-500 hover:text-emerald-400 transition-colors">
                                        <Copy className="w-3 h-3" />
                                    </button>
                                    {copied && <span className="text-[10px] text-emerald-500 font-medium">Copied!</span>}
                                </div>
                                <p className="text-xs text-zinc-500 truncate max-w-[250px] mt-0.5">{link.originalUrl}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white hover:bg-white/5">
                                <BarChart2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white hover:bg-white/5">
                                <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                        <div className="flex items-center gap-4">
                            <div>
                                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-medium">Clicks</span>
                                <span className="text-sm font-bold text-zinc-200 font-mono">{link.totalVisits}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-medium">Earned</span>
                                <span className="text-sm font-bold text-emerald-500 font-mono">{(link.totalVisits * 0.01).toFixed(2)} PLN</span>
                            </div>
                        </div>
                        <span className="text-[10px] text-zinc-600 font-medium bg-white/5 px-2 py-1 rounded border border-white/5">
                            {format(new Date(link.createdAt), 'dd.MM.yyyy')}
                        </span>
                    </div>
                </div>
            </BentoCard>
        </motion.div>
    );
}
