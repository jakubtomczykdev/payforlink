import { GlassCard } from "@/components/ui/GlassCard";
import { prisma } from "@/lib/prisma";
import { Users, DollarSign, TrendingUp, AlertTriangle, Calendar, RefreshCcw, Wallet, MousePointer2 } from "lucide-react";
import { VisitChart } from "@/components/charts/VisitChart";
import { format } from "date-fns";
import { StatsCard } from "@/components/dashboard/StatsCard";

export default async function AdminDashboardPage() {
    // Fetch Quick Stats
    const totalUsers = await prisma.user.count();
    const pendingPayouts = await prisma.payout.count({ where: { status: 'PENDING' } });
    const totalVisits = await prisma.visit.count();

    // Calculate total revenue (approximate or precise from visits)
    const totalLiability = await prisma.user.aggregate({
        _sum: { walletBalance: true }
    });

    // --- Global Traffic Chart Data ---
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const visits = await prisma.visit.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        orderBy: { createdAt: 'asc' }
    });

    const chartMap = new Map<string, { visits: number, raw: number }>();
    // Initialize last 30 days
    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = format(d, 'dd.MM.yyyy');
        chartMap.set(dateStr, { visits: 0, raw: 0 });
    }

    visits.forEach((v: any) => {
        const date = format(v.createdAt, 'dd.MM.yyyy');
        if (!chartMap.has(date)) chartMap.set(date, { visits: 0, raw: 0 });

        const entry = chartMap.get(date)!;
        entry.raw += 1;
        if (v.isMonetized) entry.visits += 1;
    });

    const chartData = Array.from(chartMap.entries())
        .map(([date, stats]) => ({ date, ...stats }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-30);
    // ---------------------------------

    return (
        <div className="space-y-8">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Przegląd Analityki</h1>
                    <p className="text-zinc-400 text-sm">Monitoruj stan systemu w czasie rzeczywistym.</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-md">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">NA ŻYWO</span>
                    </div>
                </div>
            </div>

            {/* KPI Section - Using StatsCard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Całkowite Zobowiązania"
                    value={`${totalLiability._sum.walletBalance?.toFixed(2) || '0.00'} PLN`}
                    icon={<DollarSign className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />}
                    trend="up"
                    trendValue="Live"
                />
                <StatsCard
                    title="Całkowite Kliknięcia"
                    value={totalVisits.toLocaleString()}
                    icon={<MousePointer2 className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />}
                    trend="up"
                    trendValue="+12%" // Placeholder
                />
                <StatsCard
                    title="Użytkownicy"
                    value={totalUsers.toString()}
                    icon={<Users className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />}
                    trend="up"
                    trendValue="+5"
                />
                <StatsCard
                    title="Oczekujące Wypłaty"
                    value={pendingPayouts.toString()}
                    icon={<AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />}
                    trend={pendingPayouts > 0 ? "down" : "neutral"}
                    trendValue="Akcja Wymagana"
                />
            </div>

            {/* Analytics Chart */}
            <GlassCard className="h-[400px] p-0 flex flex-col relative overflow-hidden group">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h3 className="text-zinc-100 font-semibold text-sm tracking-tight">Ruch Globalny</h3>
                        <p className="text-xs text-zinc-500">Wizyty vs Kliknięcia Monetarne</p>
                    </div>
                </div>
                <div className="flex-1 w-full p-4 relative z-0">
                    {chartData.length > 0 ? (
                        <VisitChart data={chartData} />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <p className="text-zinc-500 text-sm mb-2">Brak danych do wyświetlenia</p>
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    );
}
