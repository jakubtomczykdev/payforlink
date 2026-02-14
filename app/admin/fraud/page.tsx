import { GlassCard } from "@/components/ui/GlassCard";
import { prisma } from "@/lib/prisma";
import { ShieldAlert, User, Trash2, ArrowRight, Activity, Users } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { StatsCard } from "@/components/dashboard/StatsCard";

export default async function FraudReportsPage() {
    // Basic heuristics for "Suspicious Users"
    // 1. Users with > 30% Proxy traffic
    // 2. Users with very high raw traffic but low monetized
    const allUsers = await prisma.user.findMany({
        where: { isBanned: false, role: 'USER' },
        include: {
            links: {
                include: {
                    visits: { take: 100 } // Sample 100 recent visits
                }
            }
        }
    });

    const flaggedUsers = allUsers.map(user => {
        let totalVisits = 0;
        let proxyVisits = 0;
        let monetizedVisits = 0;

        user.links.forEach(link => {
            totalVisits += link.visits.length;
            link.visits.forEach(v => {
                if (v.isProxy) proxyVisits++;
                if (v.isMonetized) monetizedVisits++;
            });
        });

        const proxyRate = totalVisits > 0 ? (proxyVisits / totalVisits) * 100 : 0;
        const lowQualityRate = totalVisits > 0 ? ((totalVisits - monetizedVisits) / totalVisits) * 100 : 0;

        return {
            ...user,
            proxyRate,
            lowQualityRate,
            totalVisits,
            isFlagged: proxyRate > 20 || (totalVisits > 50 && lowQualityRate > 80)
        };
    }).filter(u => u.isFlagged).sort((a, b) => b.proxyRate - a.proxyRate);

    // Calculate aggregate stats
    const totalFlagged = flaggedUsers.length;
    const avgProxyRate = totalFlagged > 0 ? flaggedUsers.reduce((acc, u) => acc + u.proxyRate, 0) / totalFlagged : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                        Wykrywanie Oszustw
                        <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider border border-red-500/20">BEZPIECZEŃSTWO</span>
                    </h1>
                    <p className="text-zinc-400 text-sm">Analiza heurystyczna ruchu i oznaczanie użytkowników.</p>
                </div>
                <div className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ochrona na żywo
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Oznaczeni Użytkownicy"
                    value={totalFlagged.toString()}
                    icon={<ShieldAlert className="h-5 w-5 text-red-500" />}
                    trend={totalFlagged > 0 ? "down" : "neutral"}
                    trendValue="Wymagana Akcja"
                />
                <StatsCard
                    title="Śr. Wskaźnik Proxy"
                    value={`${avgProxyRate.toFixed(1)}%`}
                    icon={<Activity className="h-5 w-5 text-orange-500" />}
                    trend="neutral"
                    trendValue="Flagged Group"
                />
                <StatsCard
                    title="Monitorowane Konta"
                    value={allUsers.length.toString()}
                    icon={<Users className="h-5 w-5 text-blue-500" />}
                    trend="neutral"
                    trendValue="Total"
                />
            </div>

            {flaggedUsers.length === 0 ? (
                <GlassCard className="p-12 text-center text-zinc-500 border-dashed border-white/5 bg-transparent">
                    <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                        <ShieldAlert className="text-emerald-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">System Czysty</h3>
                    <p className="text-sm">W obecnej próbce nie wykryto wysoce podejrzanej aktywności.</p>
                </GlassCard>
            ) : (
                <div className="grid gap-4">
                    {flaggedUsers.map(user => (
                        <GlassCard key={user.id} className="p-6 border-l-4 border-l-red-500/50 hover:bg-white/[0.02] transition-all group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 font-bold border border-red-500/20 text-lg">
                                        {user.email[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white flex items-center gap-2">
                                            {user.email}
                                            <span className="text-[10px] bg-red-500/20 text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded font-bold tracking-wider">PODEJRZANY</span>
                                        </div>
                                        <div className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                                            Dołączył {format(user.createdAt, 'dd.MM.yyyy')}
                                            <span className="text-zinc-700">•</span>
                                            {user.totalVisits} próbkowanych zdarzeń
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 md:gap-12">
                                    <div>
                                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Wskaźnik Proxy</div>
                                        <div className={`text-xl font-bold tracking-tight ${user.proxyRate > 50 ? 'text-red-500' : 'text-orange-500'}`}>
                                            {user.proxyRate.toFixed(1)}%
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Ruch Niezbędny</div>
                                        <div className="text-xl font-bold tracking-tight text-zinc-300">
                                            {user.lowQualityRate.toFixed(1)}%
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/users/${user.id}`}
                                        className="p-2.5 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors border border-white/5"
                                        title="Szczegóły Użytkownika"
                                    >
                                        <User size={20} />
                                    </Link>
                                    <Link
                                        href={`/admin/users/${user.id}/quality`}
                                        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border border-red-500/20"
                                    >
                                        Zbadaj Ruch <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}

            <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-lg flex items-start gap-3">
                <ShieldAlert size={16} className="text-yellow-500 mt-0.5" />
                <p className="text-xs text-yellow-500/80 font-medium leading-relaxed">
                    Heurystyka opiera się obecnie na próbce ostatnich 100 wizyt na użytkownika. To jest system wczesnego ostrzegania.
                    Decyzje o blokadzie powinny być podejmowane po manualnej weryfikacji w panelu użytkownika.
                </p>
            </div>
        </div>
    );
}
