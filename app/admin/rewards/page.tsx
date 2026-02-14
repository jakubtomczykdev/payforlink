import { GlassCard } from "@/components/ui/GlassCard";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { markRewardShipped } from "@/app/actions/rewards";

export default async function AdminRewardsPage() {
    const pendingRewards = await prisma.userReward.findMany({
        where: { status: 'REQUESTED' },
        include: {
            user: true,
            reward: true
        },
        orderBy: { requestedAt: 'asc' }
    });

    const shippedHistory = await prisma.userReward.findMany({
        where: { status: { in: ['SHIPPED', 'DELIVERED'] } },
        include: {
            user: true,
            reward: true
        },
        orderBy: { processedAt: 'desc' },
        take: 20
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                        Realizacja Nagród
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-500 text-[10px] font-bold uppercase tracking-wider border border-purple-500/20">LOGISTYKA</span>
                    </h1>
                    <p className="text-zinc-400 text-sm">Zarządzaj wysyłkami nagród rzeczowych.</p>
                </div>
            </div>

            {/* Pending Requests */}
            <section className="space-y-4">
                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Package size={14} className="text-yellow-500" /> Oczekujące Wysyłki
                </h2>

                {pendingRewards.length === 0 ? (
                    <GlassCard className="p-12 text-center text-zinc-500 border-dashed border-white/5 bg-transparent">
                        <CheckCircle className="mx-auto h-12 w-12 mb-4 opacity-20 text-emerald-500" />
                        <p className="text-sm">Brak nagród do wysłania.</p>
                    </GlassCard>
                ) : (
                    <div className="grid gap-4">
                        {pendingRewards.map((item) => {
                            const details = item.shippingDetails as any;
                            return (
                                <GlassCard key={item.id} className="p-6 border-l-4 border-l-yellow-500/50 group">
                                    <div className="flex flex-col lg:flex-row justify-between gap-6">

                                        {/* Left: Reward & User */}
                                        <div className="flex gap-4">
                                            <div className="h-14 w-14 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                                <Package className="text-purple-500" size={28} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg tracking-tight">{item.reward.name}</h3>
                                                <div className="text-sm text-zinc-400 mb-1">{item.user.email}</div>
                                                <div className="text-xs text-yellow-500 flex items-center gap-1 font-mono uppercase tracking-wide">
                                                    <Clock size={12} /> Zażądano {formatDistanceToNow(item.requestedAt, { addSuffix: true, locale: pl })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Middle: Shipping Details */}
                                        <div className="bg-black/20 rounded-lg p-4 text-sm space-y-1 min-w-[300px] border border-white/5">
                                            <div className="font-bold text-zinc-200 text-xs uppercase tracking-wide mb-2 text-zinc-500">Dane Wysyłkowe</div>
                                            <div className="font-bold text-white">{details?.name}</div>
                                            <div className="text-zinc-400">{details?.address}</div>
                                            <div className="text-zinc-400 font-mono">{details?.phone}</div>
                                            {details?.size && (
                                                <div className="inline-block mt-2 px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[10px] font-bold rounded border border-white/10 uppercase">
                                                    Rozmiar: {details.size}
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Action */}
                                        <div className="flex items-center">
                                            <form action={async (formData) => {
                                                'use server';
                                                await markRewardShipped(formData);
                                            }}>
                                                <input type="hidden" name="claimId" value={item.id} />
                                                <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 text-xs uppercase tracking-wider">
                                                    <Truck size={16} /> Oznacz jako Wysłane
                                                </button>
                                            </form>
                                        </div>

                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* History */}
            <section className="space-y-4 pt-8">
                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Truck size={14} /> Ostatnie Wysyłki
                </h2>
                <GlassCard className="overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[10px] text-zinc-500 uppercase font-semibold bg-white/[0.02] border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4">Nagroda</th>
                                    <th className="px-6 py-4">Użytkownik</th>
                                    <th className="px-6 py-4">Data przetworzenia</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {shippedHistory.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 font-bold text-zinc-200">{item.reward.name}</td>
                                        <td className="px-6 py-4 text-zinc-400">{item.user.email}</td>
                                        <td className="px-6 py-4 text-zinc-500 text-xs">
                                            {item.processedAt ? formatDistanceToNow(item.processedAt, { addSuffix: true, locale: pl }) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[10px] border border-emerald-500/20 font-bold uppercase tracking-wider">
                                                <CheckCircle size={10} /> Wysłano
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            </section>
        </div>
    );
}

