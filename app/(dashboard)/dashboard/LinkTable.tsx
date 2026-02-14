'use client';

import { Button } from "@/components/ui/button";
import { type Link as LinkType } from "@prisma/client";
import { Copy, Trash2, ExternalLink, MousePointer2, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function LinkTable({ links }: { links: LinkType[] }) {
    return (
        <div className="w-full text-left overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
                <thead>
                    <tr className="text-xs uppercase tracking-wider font-semibold text-gray-500 border-b border-white/5">
                        <th className="p-4 text-left font-medium">Szczegóły Linku</th>
                        <th className="p-4 text-center font-medium">Wizyty</th>
                        <th className="p-4 text-center font-medium">Zarobki</th>
                        <th className="p-4 text-right font-medium">Akcje</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {links.map((link) => (
                        <LinkRow key={link.id} link={link} />
                    ))}
                    {links.length === 0 && (
                        <tr>
                            <td colSpan={4}>
                                <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                                    <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                        <ExternalLink className="opacity-50" />
                                    </div>
                                    <p>Nie utworzono jeszcze żadnych linków.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}


function LinkRow({ link }: { link: LinkType }) {
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

    const getModeBadge = (mode: string) => {
        switch (mode) {
            case 'PLUS':
                return <span className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 border px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider inline-block">PLUS</span>;
            case 'NSFW':
                return <span className="bg-red-500/20 text-red-500 border-red-500/40 border px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider inline-block">NSFW</span>;
            default:
                return <span className="bg-gray-500/20 text-gray-400 border-gray-500/40 border px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider inline-block">STD</span>;
        }
    };

    return (
        <tr className="group hover:bg-white/5 transition-colors">
            {/* Details Column */}
            <td className="p-4 align-middle">
                <div className="flex flex-col gap-1 max-w-[200px] sm:max-w-[300px]">
                    <div className="flex items-center gap-2">
                        <div className={`flex-shrink-0 h-2 w-2 rounded-full shadow-[0_0_8px] ${link.monetizationMode === 'NSFW' ? 'bg-red-500 shadow-red-500/50' : 'bg-emerald-500 shadow-emerald-500/50'}`} />
                        <button
                            onClick={handleCopy}
                            className="font-mono text-emerald-400 hover:text-emerald-300 hover:underline truncate transition-colors text-sm text-left"
                            title="Kliknij, aby skopiować"
                        >
                            /{link.shortCode}
                        </button>
                        <div className="flex-shrink-0">
                            {getModeBadge(link.monetizationMode)}
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 truncate pl-4 flex items-center gap-2" title={link.originalUrl}>
                        {copied ? (
                            <span className="text-emerald-500 font-medium">Skopiowano!</span>
                        ) : (
                            link.originalUrl
                        )}
                    </div>
                </div>
            </td>

            {/* Visits Column */}
            <td className="p-4 align-middle text-center">
                <div className="inline-flex items-center gap-1.5 text-gray-300 font-medium bg-white/5 px-2 py-1 rounded text-sm">
                    <MousePointer2 size={12} className="text-blue-500" />
                    {link.totalVisits}
                </div>
            </td>

            {/* Earnings Column */}
            <td className="p-4 align-middle text-center">
                <div className="inline-flex items-center gap-1.5 font-bold text-white bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 text-sm whitespace-nowrap">
                    <TrendingUp size={12} className="text-emerald-500" />
                    {link.earnings.toFixed(4)} <span className="text-[10px] text-emerald-500/70">PLN</span>
                </div>
            </td>

            {/* Actions Column */}
            <td className="p-4 align-middle text-right">
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 transition-all ${copied ? 'text-green-500 bg-green-500/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                        onClick={handleCopy}
                        title="Skopiuj link"
                    >
                        {copied ? <span className="text-xs font-bold">✓</span> : <Copy size={14} />}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={14} />
                    </Button>
                </div>
            </td>
        </tr>
    );
}
