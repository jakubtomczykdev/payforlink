import { auth } from "@/auth";
import { GlassCard } from "@/components/ui/GlassCard";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Trophy, Gift, Truck, CheckCircle, Lock } from "lucide-react";
import { ClaimRewardButton } from "./ClaimRewardButton"; // We'll create this client component

export default async function RewardsPage() {
    const session = await auth();
    if (!session || !session.user?.email) redirect("/api/auth/signin");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            rewards: true
        }
    });

    if (!user) return null;

    const allRewards = await prisma.reward.findMany({
        where: { isActive: true },
        orderBy: { threshold: 'asc' }
    });

    const lifetimeEarnings = user.lifetimeEarnings || 0;

    // Calculate progress to next reward
    const nextReward = allRewards.find(r => r.threshold > lifetimeEarnings);
    const progressPercent = nextReward
        ? Math.min(100, (lifetimeEarnings / nextReward.threshold) * 100)
        : 100;

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 border border-white/10 shadow-2xl bg-zinc-900/50 backdrop-blur-md">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-lg">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold uppercase tracking-wider">
                            <Trophy size={14} />
                            Program Lojalnościowy
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                            Twoje Osiągnięcia
                        </h1>
                        <p className="text-lg text-zinc-400">
                            Zarabiaj na skracaniu linków i odbieraj ekskluzywne nagrody. Każda złotówka przybliża Cię do celu.
                        </p>
                    </div>

                    <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-center min-w-[280px] shadow-xl backdrop-blur-sm">
                        <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Całkowite Zarobki</div>
                        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm">
                            {lifetimeEarnings.toFixed(2)} <span className="text-2xl text-zinc-500">PLN</span>
                        </div>
                    </div>
                </div>

                {/* Main Progress Bar */}
                {nextReward && (
                    <div className="mt-12 relative z-10">
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <div className="text-sm font-bold text-white mb-1">Następny Cel: {nextReward.name}</div>
                                <div className="text-xs text-zinc-400">Brakuje tylko <span className="text-emerald-400 font-mono">{(nextReward.threshold - lifetimeEarnings).toFixed(2)} PLN</span></div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">{progressPercent.toFixed(1)}%</div>
                            </div>
                        </div>
                        <div className="h-6 bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
                            {/* Milestones indicators can go here if we had their exact positions relative to this bar, 
                                 but for a single "next reward" bar, a simple fill is cleaner. 
                             */}
                            <div
                                className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] relative overflow-hidden"
                                style={{ width: `${progressPercent}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" style={{ transform: 'skewX(-20deg)' }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allRewards.map((reward) => {
                    const claimed = user.rewards.find(ur => ur.rewardId === reward.id);
                    const isUnlocked = lifetimeEarnings >= reward.threshold;
                    const isClaimed = !!claimed;

                    return (
                        <div
                            key={reward.id}
                            className={`group relative p-6 flex flex-col h-full rounded-2xl border transition-all duration-300 ${isUnlocked
                                    ? 'bg-zinc-900/40 border-white/10 hover:border-emerald-500/30 hover:bg-zinc-900/60 shadow-lg hover:shadow-emerald-500/10'
                                    : 'bg-zinc-900/20 border-white/5 opacity-75'
                                }`}
                        >
                            {/* Background Glow for Unlocked */}
                            {isUnlocked && <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />}

                            <div className="relative z-10 flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-xl shadow-inner ${isClaimed ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' :
                                        isUnlocked ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/20' :
                                            'bg-zinc-800/50 text-zinc-600 border border-white/5'
                                    }`}>
                                    {isClaimed ? <CheckCircle size={28} /> : isUnlocked ? <Gift size={28} /> : <Lock size={28} />}
                                </div>
                                <div className={`text-xs font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider ${isUnlocked ? 'bg-white/5 text-white border-white/10' : 'bg-black/20 text-zinc-600 border-white/5'
                                    }`}>
                                    {reward.threshold} PLN
                                </div>
                            </div>

                            <div className="relative z-10 mb-6">
                                <h3 className={`text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors ${isUnlocked ? 'text-white' : 'text-zinc-500'}`}>
                                    {reward.name}
                                </h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    {reward.description}
                                </p>
                            </div>

                            <div className="relative z-10 mt-auto">
                                {isClaimed ? (
                                    <div className="w-full py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center font-bold text-emerald-400 flex items-center justify-center gap-2">
                                        {claimed.status === 'SHIPPED' ? <Truck size={18} /> : <CheckCircle size={18} />}
                                        <span className="text-xs uppercase tracking-wider">{claimed.status === 'SHIPPED' ? 'WYSŁANO' : 'ODEBRANO'}</span>
                                    </div>
                                ) : isUnlocked ? (
                                    <ClaimRewardButton reward={reward} />
                                ) : (
                                    <div className="w-full py-4 rounded-xl bg-zinc-800/50 border border-white/5 text-center text-zinc-600 font-bold text-xs uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-2">
                                        <Lock size={14} />
                                        Zablokowane
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
