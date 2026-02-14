'use client';

import { Button } from "@/components/ui/button";
import { type Link as LinkType } from "@prisma/client";
import { Copy, Trash2, ExternalLink, MousePointer2, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function LinkTable({ links }: { links: LinkType[] }) {
    return (
        <div className="w-full text-left">
            <div className="grid grid-cols-12 gap-4 p-4 text-xs uppercase tracking-wider font-semibold text-gray-500 border-b border-white/5">
                <div className="col-span-5">Szczegóły Linku</div>
                <div className="col-span-2 text-center">Wizyty</div>
                <div className="col-span-3 text-center">Zarobki</div>
                <div className="col-span-2 text-right">Akcje</div>
            </div>
            <div className="divide-y divide-white/5">
                {links.map((link) => (
                    <LinkRow key={link.id} link={link} />
                ))}
                {links.length === 0 && (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <ExternalLink className="opacity-50" />
                        </div>
                        <p>Nie utworzono jeszcze żadnych linków.</p>
                    </div>
                )}
            </div>
        </div>
    );
}


function LinkRow({ link }: { link: LinkType }) {
    const [copied, setCopied] = useState(false);
    const [origin, setOrigin] = useState('');

    useState(() => {
        if (typeof window !== 'undefined') {
            setOrigin(window.location.origin);
        }
    });

    const shortUrl = `${origin}/${link.shortCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getModeBadge = (mode: string) => {
        switch (mode) {
            case 'PLUS':
                return <span className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 border px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">PLUS</span>;
            case 'NSFW':
                return <span className="bg-red-500/20 text-red-500 border-red-500/40 border px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">NSFW</span>;
            default:
                return <span className="bg-gray-500/20 text-gray-400 border-gray-500/40 border px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">STD</span>;
        }
    };

    return (
        <div className="grid grid-cols-12 gap-4 p-4 items-center text-sm border-b border-white/5 hover:bg-white/5 transition-colors group">
            <div className="col-span-5 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1">
                    <div className={`h-2 w-2 rounded-full shadow-[0_0_8px] ${link.monetizationMode === 'NSFW' ? 'bg-red-500 shadow-red-500/50' : 'bg-emerald-500 shadow-emerald-500/50'}`} />
                    <a href={shortUrl} target="_blank" className="font-mono text-emerald-400 hover:text-emerald-300 hover:underline truncate transition-colors">
                        /{link.shortCode}
                    </a>
                    {getModeBadge(link.monetizationMode)}
                </div>
                <div className="text-xs text-gray-500 truncate" title={link.originalUrl}>
                    {link.originalUrl}
                </div>
            </div>

            <div className="col-span-2 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5 text-gray-300 font-medium bg-white/5 px-2 py-1 rounded">
                    <MousePointer2 size={12} className="text-blue-500" />
                    {link.totalVisits}
                </div>
            </div>

            <div className="col-span-3 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5 font-bold text-white bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    <TrendingUp size={12} className="text-emerald-500" />
                    {link.earnings.toFixed(4)} <span className="text-[10px] text-emerald-500/70">PLN</span>
                </div>
            </div>

            <div className="col-span-2 flex justify-end gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 transition-all ${copied ? 'text-green-500 bg-green-500/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                    onClick={handleCopy}
                    title="Skopiuj link"
                >
                    {copied ? <span className="text-xs font-bold">✓</span> : <Copy size={14} />}
                </Button>
                {/* Delete to be implemented via Server Action */}
                <Button variant="ghost" size="sm" className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors">
                    <Trash2 size={14} />
                </Button>
            </div>
        </div>
    );
}
