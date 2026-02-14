'use client';

import { type Link as LinkType } from "@prisma/client";
import { useState, useEffect } from "react";
import { Copy } from "lucide-react";

export function RecentLinks({ links }: { links: LinkType[] }) {
    return (
        <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
                <h2 className="text-sm font-semibold text-zinc-100">Ostatnie Linki</h2>
                <a href="/dashboard/create">
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 text-xs font-bold rounded-lg transition-all shadow-sm">
                        + Nowy Link
                    </button>
                </a>
            </div>
            <div className="p-0 overflow-x-auto">
                {links.length > 0 ? (
                    <div className="w-full min-w-[600px]">
                        <div className="grid grid-cols-12 gap-4 px-5 py-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider bg-white/[0.02] border-b border-white/5">
                            <div className="col-span-6">Link</div>
                            <div className="col-span-3 text-right">Wizyty</div>
                            <div className="col-span-3 text-right">Zarobiono</div>
                        </div>
                        {links.map((link) => (
                            <RecentLinkItem key={link.id} link={link} />
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center text-zinc-500">
                        No links found. Create one to get started!
                    </div>
                )}
            </div>
        </div>
    );
}

function RecentLinkItem({ link }: { link: LinkType }) {
    const [copied, setCopied] = useState(false);
    const [origin, setOrigin] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOrigin(window.location.origin);
        }
    }, []);

    const shortUrl = `${origin}/${link.shortCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center text-sm group">
            <div className="col-span-6 min-w-0">
                <button
                    onClick={handleCopy}
                    className="font-medium text-zinc-200 truncate hover:text-emerald-500 transition-colors cursor-pointer text-left w-full flex items-center gap-2"
                    title="Kliknij, aby skopiować"
                >
                    <span className="truncate">/{link.shortCode}</span>
                    {copied && <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded ml-2">Skopiowano!</span>}
                </button>
                <div className="text-zinc-500 text-xs truncate mt-0.5">{link.originalUrl}</div>
            </div>
            <div className="col-span-3 text-right font-mono text-zinc-300">
                {link.totalVisits}
            </div>
            <div className="col-span-3 text-right font-mono font-medium text-emerald-500">
                {(link.totalVisits * 0.01).toFixed(2)} PLN
            </div>
        </div>
    );
}
