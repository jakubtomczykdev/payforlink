import { GlassCard } from "@/components/ui/GlassCard";
import { prisma } from "@/lib/prisma";
import { Users, DollarSign, TrendingUp, AlertTriangle, Calendar, RefreshCcw } from "lucide-react";
import { VisitChart } from "@/components/charts/VisitChart";
import { format } from "date-fns";

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
        <div className="space-y-6">
            {/* Analytics Overview Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white tracking-tight">Przegląd Analityki</h2>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-md">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">NA ŻYWO • 24H</span>
                        </div>
                        <button className="px-3 py-1 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] rounded-md text-xs font-medium text-gray-400 transition-colors flex items-center gap-2">
                            Dzisiaj <Calendar size={12} />
                        </button>
                        <button className="p-1.5 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] rounded-md text-gray-400 transition-colors">
                            <RefreshCcw size={14} />
                        </button>
                    </div>
                </div>

                <GlassCard className="h-[400px] p-0 flex flex-col relative overflow-hidden group">
                    {/* Empty state placeholder or actual chart */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#09090B]/80 z-10 pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                        <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-medium text-white shadow-xl">
                            Interaktywny Wykres Aktywny
                        </div>
                    </div>
                    <div className="flex-1 w-full p-4 relative z-0">
                        {chartData.length > 0 ? (
                            <VisitChart data={chartData} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <p className="text-gray-500 text-sm mb-2">Zacznij kierować ruch, aby zobaczyć analitykę</p>
                                <button className="text-xs text-emerald-500 hover:text-emerald-400 underline">Pokaż przewodnik startowy</button>
                            </div>
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Bottom KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <GlassCard gradient className="p-6 relative overflow-hidden group">
                    <div className="absolute right-4 top-4 opacity-20 group-hover:opacity-40 transition-opacity">
                        <DollarSign size={40} className="text-emerald-500" />
                    </div>
                    <div className="text-sm font-medium text-gray-400 mb-1">Całkowite Zobowiązania</div>
                    <div className="text-3xl font-black text-white tracking-tight">
                        {totalLiability._sum.walletBalance?.toFixed(2) || '0.00'} <span className="text-lg text-emerald-500">PLN</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest font-bold">Zaktualizowano Przed Chwilą</div>
                </GlassCard>

                <GlassCard className="p-6 relative overflow-hidden group flex flex-col justify-center items-center text-center">
                    <div className="mb-2 text-gray-500 group-hover:text-emerald-500 transition-colors">
                        <TrendingUp size={24} />
                    </div>
                    <div className="text-3xl font-black text-white mb-1">{totalVisits.toLocaleString()}</div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-emerald-500">Całkowite Kliknięcia</div>
                </GlassCard>

                <GlassCard className="p-6 relative overflow-hidden group flex flex-col justify-center items-center text-center">
                    <div className="mb-2 text-gray-500 group-hover:text-blue-500 transition-colors relative">
                        <AlertTriangle size={24} />
                        {pendingPayouts > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />}
                    </div>
                    <div className="text-3xl font-black text-white mb-1">{pendingPayouts}</div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Oczekujące Wypłaty</div>
                </GlassCard>
            </div>
        </div>
    );
}
