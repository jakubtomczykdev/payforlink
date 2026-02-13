import { GlassCard } from "@/components/ui/GlassCard";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, ShieldCheck, Globe, Activity } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VisitChart } from "@/components/charts/VisitChart";
import { format } from "date-fns";

export default async function UserQualityPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch User & Visits
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            links: {
                include: {
                    visits: {
                        orderBy: { createdAt: 'desc' },
                        take: 500
                    }
                }
            }
        }
    });

    if (!user) return notFound();

    // Aggregate Data
    let totalSampledVisits = 0;
    let proxyCount = 0;
    let uniqueIPs = new Set();
    let countries: Record<string, number> = {};

    // Chart Data Aggregation
    const chartMap = new Map<string, { visits: number, raw: number }>();

    user.links.forEach((link: any) => {
        link.visits.forEach((visit: any) => {
            totalSampledVisits++;
            if (visit.isProxy) proxyCount++;
            uniqueIPs.add(visit.ipHash);

            const country = visit.country || 'Unknown';
            countries[country] = (countries[country] || 0) + 1;

            // Chart agg
            const date = format(visit.createdAt, 'dd.MM.yyyy');
            if (!chartMap.has(date)) chartMap.set(date, { visits: 0, raw: 0 });
            const entry = chartMap.get(date)!;
            entry.raw += 1;
            if (visit.isMonetized) entry.visits += 1;
        });
    });

    const chartData = Array.from(chartMap.entries())
        .map(([date, stats]) => ({ date, ...stats }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const uniqueRate = totalSampledVisits > 0 ? (uniqueIPs.size / totalSampledVisits) * 100 : 0;
    const proxyRate = totalSampledVisits > 0 ? (proxyCount / totalSampledVisits) * 100 : 0;

    // Determine Quality Score (Simple heuristic)
    // - High Uniqueness is good
    // - Low Proxy is good
    let qualityScore = 100;
    if (uniqueRate < 50) qualityScore -= 20;
    if (uniqueRate < 20) qualityScore -= 40;
    if (proxyRate > 10) qualityScore -= 30;
    if (proxyRate > 50) qualityScore -= 50;

    // Quality Grade Color
    const gradeColor = qualityScore > 80 ? 'text-emerald-500' : qualityScore > 50 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/admin/users/${id}`} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/10">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        Traffic Quality Analysis
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-wider border border-blue-500/20">ANALYTICS</span>
                    </h1>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">{user.email}</div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Score */}
                <GlassCard gradient className="p-8 text-center md:col-span-1 flex flex-col items-center justify-center border-white/20">
                    <div className={`p-4 rounded-full bg-black/40 mb-4 border-2 ${gradeColor.replace('text-', 'border-').replace('500', '500/50')}`}>
                        <ShieldCheck size={48} className={gradeColor} />
                    </div>
                    <div className={`text-6xl font-black mb-2 tracking-tighter ${gradeColor}`}>{Math.max(0, qualityScore)}</div>
                    <div className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Overall Quality Score</div>
                </GlassCard>

                {/* Detailed Metrics */}
                <div className="md:col-span-2 grid gap-6 grid-cols-2">
                    <GlassCard className="p-6 relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-4 text-gray-400">
                            <Activity size={18} className="text-emerald-500" />
                            <span className="text-xs font-bold uppercase tracking-widest">Uniqueness Rate</span>
                        </div>
                        <div className="text-3xl font-black text-white">{uniqueRate.toFixed(1)}%</div>
                        <div className="text-[10px] text-gray-500 mt-2 font-medium uppercase tracking-tighter">
                            {uniqueIPs.size} unique IPs / {totalSampledVisits} samples
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Activity size={80} />
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6 relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-4 text-gray-400">
                            <Globe size={18} className="text-red-500" />
                            <span className="text-xs font-bold uppercase tracking-widest">Proxy / VPN Risk</span>
                        </div>
                        <div className="text-3xl font-black text-white">{proxyRate.toFixed(1)}%</div>
                        <div className="text-[10px] text-gray-500 mt-2 font-medium uppercase tracking-tighter">
                            {proxyCount} detected flags
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ShieldCheck size={80} />
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6 col-span-2">
                        <h3 className="text-xs font-bold text-gray-500 mb-6 uppercase tracking-widest">Geographical Distribution</h3>
                        <div className="space-y-4">
                            {totalSampledVisits === 0 ? (
                                <div className="text-center py-4 text-gray-500 italic text-sm">No data available</div>
                            ) : (
                                Object.entries(countries)
                                    .sort(([, a], [, b]) => b - a)
                                    .slice(0, 4)
                                    .map(([code, count]) => (
                                        <div key={code} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-6 bg-white/5 rounded-sm flex items-center justify-center text-[10px] text-white/50 font-bold border border-white/5 uppercase">
                                                    {code}
                                                </div>
                                                <span className="text-white text-sm font-medium">{code}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-500 shadow-sm shadow-emerald-500/20"
                                                        style={{ width: `${(count / totalSampledVisits) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-mono text-gray-500 w-12 text-right">{((count / totalSampledVisits) * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>

            <GlassCard className="p-0 overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-white/5 font-bold text-white flex items-center justify-between">
                    <span className="text-sm uppercase tracking-widest">Recent Traffic History</span>
                    <span className="text-[10px] text-gray-500 font-medium">Daily Aggregates</span>
                </div>
                <div className="p-6 h-64">
                    {chartData.length > 0 ? (
                        <VisitChart data={chartData} />
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 italic text-sm">
                            Not enough data for chart
                        </div>
                    )}
                </div>
            </GlassCard>
        </div >
    );
}
