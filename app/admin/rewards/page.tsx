import { GlassCard } from "@/components/ui/GlassCard";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { markRewardShipped } from "@/app/actions/rewards"; // Create this action export if not already there, I think I put it in the same file.

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
                    <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        Realizacja Nagród
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-500 text-[10px] font-black uppercase tracking-wider border border-purple-500/20">LOGISTYKA</span>
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Zarządzaj wysyłkami nagród rzeczowych.</p>
                </div>
            </div>

            {/* Pending Requests */}
            <section className="space-y-4">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Package size={16} className="text-yellow-500" /> Oczekujące Wysyłki
                </h2>

                {pendingRewards.length === 0 ? (
                    <GlassCard className="p-12 text-center text-gray-500 border-dashed border-white/5">
                        <CheckCircle className="mx-auto h-12 w-12 mb-4 opacity-20 text-emerald-500" />
                        <h3 className="text-xl font-medium text-white/50">Wszystko Zrobione</h3>
                        <p className="text-sm">Brak nagród do wysłania.</p>
                    </GlassCard>
                ) : (
                    <div className="grid gap-4">
                        {pendingRewards.map((item) => {
                            const details = item.shippingDetails as any;
                            return (
                                <GlassCard key={item.id} className="p-6 border-l-2 border-l-yellow-500/50">
                                    <div className="flex flex-col lg:flex-row justify-between gap-6">

                                        {/* Left: Reward & User */}
                                        <div className="flex gap-4">
                                            <div className="h-16 w-16 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                                <Package className="text-purple-400" size={32} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg">{item.reward.name}</h3>
                                                <div className="text-sm text-gray-400 mb-1">{item.user.email}</div>
                                                <div className="text-xs text-yellow-500 flex items-center gap-1 font-mono">
                                                    <Clock size={12} /> Zażądano {formatDistanceToNow(item.requestedAt, { addSuffix: true, locale: pl })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Middle: Shipping Details */}
                                        <div className="bg-black/30 rounded-lg p-4 text-sm space-y-1 min-w-[300px] border border-white/5">
                                            <div className="font-bold text-white">{details?.name}</div>
                                            <div className="text-gray-400">{details?.address}</div>
                                            <div className="text-gray-400">{details?.phone}</div>
                                            {details?.size && (
                                                <div className="inline-block mt-2 px-2 py-0.5 bg-gray-700 text-white text-xs rounded border border-gray-600">
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
                                                <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20">
                                                    <Truck size={18} /> Oznacz jako Wysłane
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
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Truck size={16} /> Ostatnie Wysyłki
                </h2>
                <GlassCard className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-white/5">
                                <tr>
                                    <th className="px-6 py-4">Nagroda</th>
                                    <th className="px-6 py-4">Użytkownik</th>
                                    <th className="px-6 py-4">Data przetworzenia</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {shippedHistory.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/[0.01]">
                                        <td className="px-6 py-4 font-bold text-white">{item.reward.name}</td>
                                        <td className="px-6 py-4 text-gray-400">{item.user.email}</td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {item.processedAt ? formatDistanceToNow(item.processedAt, { addSuffix: true, locale: pl }) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 text-emerald-500 text-xs font-bold uppercase">
                                                <CheckCircle size={12} /> Wysłano
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

