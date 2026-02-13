import { GlassCard } from "@/components/ui/GlassCard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Globe, ShieldAlert, Monitor, User, Zap, Activity, Eye } from "lucide-react";

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
                    <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        Ruch na Żywo
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Strumień wizyt w czasie rzeczywistym.</p>
                </div>
                <form action={refresh}>
                    <button className="bg-white/[0.05] hover:bg-white/[0.1] text-white px-3 py-1.5 rounded-lg text-xs transition-colors border border-white/10 flex items-center gap-2 font-medium uppercase tracking-wider">
                        <Zap size={14} className="text-yellow-400" />
                        Odśwież
                    </button>
                </form>
            </div>

            {/* Live Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-2 text-gray-400">
                        <Activity size={18} className="text-emerald-500" />
                        <span className="text-sm font-medium uppercase tracking-wider">Kliknięcia (24h)</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{last24hVisits.toLocaleString()}</div>
                    <p className="text-xs text-gray-500 mt-1">Całkowity ruch przychodzący</p>
                </GlassCard>

                <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-2 text-gray-400">
                        <ShieldAlert size={18} className="text-red-500" />
                        <span className="text-sm font-medium uppercase tracking-wider">Wskaźnik Proxy (24h)</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{proxyRate.toFixed(1)}%</div>
                    <p className="text-xs text-gray-500 mt-1">{last24hProxy} podejrzanych żądań</p>
                </GlassCard>

                <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-2 text-gray-400">
                        <Eye size={18} className="text-blue-500" />
                        <span className="text-sm font-medium uppercase tracking-wider">Zmonetyzowane (24h)</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{last24hMonetized.toLocaleString()}</div>
                    <p className="text-xs text-gray-500 mt-1">Prawdziwy ruch ludzki</p>
                </GlassCard>
            </div>

            <GlassCard className="overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-white/5 font-semibold text-white flex items-center justify-between">
                    <span>Strumień Ostatniej Aktywności</span>
                    <span className="text-xs text-gray-500 font-normal">Pokazuję ostatnie 50 zdarzeń</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-white/5">
                            <tr>
                                <th className="px-6 py-3">Czas</th>
                                <th className="px-6 py-3">Użytkownik</th>
                                <th className="px-6 py-3">Adres IP</th>
                                <th className="px-6 py-3">Lokalizacja</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {visits.map((visit) => (
                                <tr key={visit.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-gray-400 text-xs">
                                        {visit.createdAt.toLocaleTimeString('pl-PL')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-[10px] text-white font-bold">
                                                {visit.link.user.email[0].toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">{visit.link.user.email.split('@')[0]}</span>
                                                <span className="text-[10px] text-gray-500">{visit.link.user.email}</span>
                                            </div>
                                            {visit.link.user.isBanned && (
                                                <span className="text-[9px] bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded border border-red-500/20 font-bold">ZBANOWANY</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-[10px] text-gray-400">
                                        {visit.ipHash}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">{visit.country === 'PL' ? '🇵🇱' : '🌍'}</span>
                                            <div className="flex flex-col">
                                                <span className="text-gray-300 text-xs">{visit.city || 'Nieznane'}</span>
                                                <span className="text-gray-500 text-[10px] uppercase font-bold">{visit.country}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {visit.isProxy ? (
                                            <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full text-[10px] border border-red-500/20 font-bold uppercase tracking-wider">
                                                <ShieldAlert size={10} /> PROXY
                                            </span>
                                        ) : visit.isMonetized ? (
                                            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] border border-emerald-500/20 font-bold uppercase tracking-wider">
                                                <Zap size={10} /> PŁATNE
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full text-[10px] border border-blue-500/20 font-bold uppercase tracking-wider">
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


