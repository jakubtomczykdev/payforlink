import { GlassCard } from "@/components/ui/GlassCard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Globe, ShieldAlert, Monitor, User, Zap, Activity, Eye, MousePointer2 } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

export default async function LiveTrafficPage() {
    // Fetch last 50 visits globally
    const visits = await prisma.visit.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: {
            link: {
                include: { user: true }
            }
        }
    });

    // Calculate quick stats for last 24h
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last24hVisits = await prisma.visit.count({
        where: { createdAt: { gte: twentyFourHoursAgo } }
    });
    const last24hProxy = await prisma.visit.count({
        where: {
            createdAt: { gte: twentyFourHoursAgo },
            isProxy: true
        }
    });
    const last24hMonetized = await prisma.visit.count({
        where: {
            createdAt: { gte: twentyFourHoursAgo },
            isMonetized: true
        }
    });

    const proxyRate = last24hVisits > 0 ? (last24hProxy / last24hVisits) * 100 : 0;

    async function refresh() {
        'use server';
        revalidatePath('/admin/live');
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                        Ruch na Żywo
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                    </h1>
                    <p className="text-zinc-400 text-sm">Strumień wizyt w czasie rzeczywistym.</p>
                </div>
                <form action={refresh}>
                    <button className="bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs transition-colors border border-white/10 flex items-center gap-2 font-medium uppercase tracking-wider">
                        <Zap size={14} className="text-yellow-400" />
                        Odśwież
                    </button>
                </form>
            </div>

            {/* Live Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Kliknięcia (24h)"
                    value={last24hVisits.toLocaleString()}
                    icon={<MousePointer2 className="h-5 w-5 text-emerald-500" />}
                    trend="neutral"
                    trendValue="Live"
                />
                <StatsCard
                    title="Wskaźnik Proxy (24h)"
                    value={`${proxyRate.toFixed(1)}%`}
                    icon={<ShieldAlert className="h-5 w-5 text-red-500" />}
                    trend="neutral"
                    trendValue={last24hProxy.toString()}
                />
                <StatsCard
                    title="Zmonetyzowane (24h)"
                    value={last24hMonetized.toLocaleString()}
                    icon={<Zap className="h-5 w-5 text-blue-500" />}
                    trend="neutral"
                    trendValue="Real"
                />
            </div>

            <GlassCard className="overflow-hidden p-0">
                <div className="p-4 border-b border-white/5 bg-white/[0.02] font-semibold text-zinc-100 flex items-center justify-between">
                    <span className="text-sm">Ostatnia Aktywność</span>
                    <span className="text-xs text-zinc-500 font-normal">Ostatnie 50 zdarzeń</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] text-zinc-500 uppercase font-semibold bg-white/[0.02] border-b border-white/5">
                            <tr>
                                <th className="px-6 py-3">Czas</th>
                                <th className="px-6 py-3">Użytkownik</th>
                                <th className="px-6 py-3">IP / Hash</th>
                                <th className="px-6 py-3">Lokalizacja</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {visits.map((visit) => (
                                <tr key={visit.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 font-mono text-zinc-500 text-xs">
                                        {visit.createdAt.toLocaleTimeString('pl-PL')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-zinc-800 border border-white/5 flex items-center justify-center text-[10px] text-zinc-400 font-bold">
                                                {visit.link.user.email[0].toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-zinc-300 font-medium text-xs">{visit.link.user.email.split('@')[0]}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-[10px] text-zinc-600">
                                        {visit.ipHash.substring(0, 16)}...
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">{visit.country === 'PL' ? '🇵🇱' : '🌍'}</span>
                                            <div className="flex flex-col">
                                                <span className="text-zinc-400 text-xs">{visit.city || 'Nieznane'}</span>
                                                <span className="text-zinc-600 text-[10px] uppercase font-bold">{visit.country}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {visit.isProxy ? (
                                            <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-[10px] border border-red-500/20 font-bold uppercase tracking-wider">
                                                <ShieldAlert size={10} /> PROXY
                                            </span>
                                        ) : visit.isMonetized ? (
                                            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[10px] border border-emerald-500/20 font-bold uppercase tracking-wider">
                                                <Zap size={10} /> PŁATNE
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-[10px] border border-blue-500/20 font-bold uppercase tracking-wider">
                                                <Eye size={10} /> SUROWE
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}



