import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DollarSign, MousePointer2, TrendingUp, Users, Plus, ArrowRight, Wallet } from "lucide-react";
import { format, startOfWeek, addDays, isSameDay, subDays } from "date-fns";

import { StreakWidget } from "@/components/dashboard/StreakWidget";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { VisitChart } from "@/components/charts/VisitChart"; // Keeping chart for now as it adds value
import { QuickShortener } from "@/components/dashboard/QuickShortener";
import { NotificationFeed } from "@/components/dashboard/NotificationFeed";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const session = await auth();
    if (!session || !session.user?.email) {
        redirect("/api/auth/signin");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            links: {
                orderBy: { createdAt: 'desc' },
            },
            payouts: true
        }
    });

    if (!user) return <div>User not found</div>;

    // Fetch visits for charts and streak (last 30 days)
    const thirtyDaysAgo = subDays(new Date(), 30);

    const visits = await prisma.visit.findMany({
        where: {
            link: { userId: user.id },
            createdAt: { gte: thirtyDaysAgo }
        },
        orderBy: { createdAt: 'asc' }
    });

    const totalLinks = user.links.length;
    const totalClicks = user.links.reduce((acc: number, link: { totalVisits: number }) => acc + link.totalVisits, 0);
    const walletBalance = user.walletBalance;

    // Calculate Total Revenue (Balance + All Payouts that are not Rejected)
    // This serves as a "Lifetime Earnings" proxy if the field is not maintained
    const payoutsSum = user.payouts.reduce((acc: number, p: { amount: number, status: string }) => {
        return p.status !== 'REJECTED' ? acc + p.amount : acc;
    }, 0);
    const totalRevenue = walletBalance + payoutsSum;

    const avgCpm = 10.00;

    // Chart Data logic - Generate last 14 days in correct order
    const chartData = [];
    for (let i = 13; i >= 0; i--) {
        const d = subDays(new Date(), i);
        const dateStr = format(d, 'dd.MM.yyyy');

        const dayStats = {
            date: dateStr,
            visits: 0,
            raw: 0
        };

        visits.forEach((v: any) => {
            if (format(v.createdAt, 'dd.MM.yyyy') === dateStr) {
                dayStats.raw++;
                if (v.isMonetized) dayStats.visits++;
            }
        });

        chartData.push(dayStats);
    }

    // Streak Calculation
    // Group all visits by date to find unique active days
    const activeDays = new Set(visits.map(v => format(v.createdAt, 'yyyy-MM-dd')));
    let currentStreak = 0;
    let checkDate = new Date();

    // Check if user was active today or yesterday (to maintain streak)
    const todayStr = format(checkDate, 'yyyy-MM-dd');
    const yesterdayStr = format(subDays(checkDate, 1), 'yyyy-MM-dd');

    if (activeDays.has(todayStr) || activeDays.has(yesterdayStr)) {
        // If active today, start from today. If only active yesterday, start from yesterday.
        let iterateDate = activeDays.has(todayStr) ? checkDate : subDays(checkDate, 1);

        while (activeDays.has(format(iterateDate, 'yyyy-MM-dd'))) {
            currentStreak++;
            iterateDate = subDays(iterateDate, 1);
        }
    }

    // Current Week Activity (Monday to Sunday)
    const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
    const polishDays = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
    const weekActivity = Array.from({ length: 7 }, (_, i) => {
        const day = addDays(monday, i);
        return {
            name: polishDays[i],
            active: activeDays.has(format(day, 'yyyy-MM-dd'))
        };
    });

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-8 font-sans text-zinc-100">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Przegląd Panelu</h1>
                    <p className="text-zinc-500 text-sm">Witaj ponownie, {user.name || 'Użytkowniku'}</p>
                </div>
                {/* QuickShortener moved to sidebar */}
            </header>

            {/* Dashboard Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Stats Section - Full width on mobile/desktop top row */}
                <div className="order-2 lg:order-1 lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <StatsCard
                        title="Przychód"
                        value={`${totalRevenue.toFixed(2)} ${user.currency}`}
                        icon={<DollarSign className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />}
                        trend="up"
                        trendValue="+12.5%"
                    />
                    <StatsCard
                        title="Kliknięcia"
                        value={totalClicks.toLocaleString()}
                        icon={<MousePointer2 className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />}
                        trend="up"
                        trendValue="+5.2%"
                    />
                    <StatsCard
                        title="Aktywne Linki"
                        value={totalLinks.toString()}
                        icon={<TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />}
                        trend="neutral"
                        trendValue="0.0%"
                    />
                    <StatsCard
                        title="Portfel"
                        value={`${walletBalance.toFixed(2)} ${user.currency}`}
                        icon={<Wallet className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />}
                        trend="up"
                        trendValue="Natychmiast"
                    />
                </div>

                {/* Main Content (Chart + Links) */}
                <div className="order-1 lg:order-2 lg:col-span-2 space-y-6">
                    {/* Functional Line Chart */}
                    <div className="h-[300px] md:h-[400px]">
                        <VisitChart data={chartData} />
                    </div>

                    {/* Recent Links */}
                    <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                        <div className="flex items-center justify-between p-5 border-b border-white/5">
                            <h2 className="text-sm font-semibold text-zinc-100">Ostatnie Linki</h2>
                            <Link href="/dashboard/create">
                                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 text-xs font-bold rounded-lg transition-all shadow-sm">
                                    <Plus size={16} />
                                    Nowy Link
                                </button>
                            </Link>
                        </div>
                        <div className="p-0">
                            {user.links.length > 0 ? (
                                <div className="w-full">
                                    <div className="grid grid-cols-12 gap-4 px-5 py-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider bg-white/[0.02] border-b border-white/5">
                                        <div className="col-span-6">Link</div>
                                        <div className="col-span-3 text-right">Wizyty</div>
                                        <div className="col-span-3 text-right">Zarobiono</div>
                                    </div>
                                    {user.links.slice(0, 5).map((link) => (
                                        <div key={link.id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center text-sm">
                                            <div className="col-span-6 min-w-0">
                                                <div className="font-medium text-zinc-200 truncate hover:text-emerald-500 transition-colors cursor-pointer">
                                                    /{link.shortCode}
                                                </div>
                                                <div className="text-zinc-500 text-xs truncate mt-0.5">{link.originalUrl}</div>
                                            </div>
                                            <div className="col-span-3 text-right font-mono text-zinc-300">
                                                {link.totalVisits}
                                            </div>
                                            <div className="col-span-3 text-right font-mono font-medium text-emerald-500">
                                                {(link.totalVisits * 0.01).toFixed(2)} PLN
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-zinc-500">
                                    No links found. Create one to get started!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar (New) */}
                <div className="order-3 lg:order-3 space-y-6">
                    <QuickShortener variant="sidebar" />
                    <StreakWidget streak={currentStreak} weekActivity={weekActivity} />
                    <NotificationFeed />
                </div>

            </div>
        </div>
    );
}
