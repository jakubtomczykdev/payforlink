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
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Trophy className="text-yellow-500" />
                        Nagrody za Osiągnięcia
                    </h1>
                    <p className="text-gray-400 mt-1">Odblokuj ekskluzywne nagrody, osiągając kamienie milowe zarobków.</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-400 uppercase tracking-widest font-bold">Całkowite Zarobki</div>
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                        {lifetimeEarnings.toFixed(2)} PLN
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            {nextReward && (
                <GlassCard className="p-6 relative overflow-hidden">
                    <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-emerald-400">Aktualnie: {lifetimeEarnings.toFixed(0)} PLN</span>
                        <span className="text-gray-400">Następny Cel: {nextReward.threshold.toFixed(0)} PLN ({nextReward.name})</span>
                    </div>
                    <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </GlassCard>
            )}

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allRewards.map((reward) => {
                    const claimed = user.rewards.find(ur => ur.rewardId === reward.id);
                    const isUnlocked = lifetimeEarnings >= reward.threshold;
                    const isClaimed = !!claimed;

                    return (
                        <GlassCard
                            key={reward.id}
                            className={`p-6 flex flex-col h-full ${!isUnlocked && 'opacity-60 grayscale-[0.5]'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${isUnlocked ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-800 text-gray-500'}`}>
                                    {isClaimed ? <CheckCircle size={24} /> : isUnlocked ? <Gift size={24} /> : <Lock size={24} />}
                                </div>
                                <div className="text-xs font-bold px-2 py-1 rounded bg-white/5 border border-white/10 uppercase tracking-wider">
                                    {reward.threshold} PLN
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{reward.name}</h3>
                            <p className="text-sm text-gray-400 mb-6 flex-grow">{reward.description}</p>

                            <div className="mt-auto">
                                {isClaimed ? (
                                    <div className="w-full py-3 rounded-xl bg-gray-800/50 border border-white/5 text-center text-sm font-bold text-gray-300 flex items-center justify-center gap-2">
                                        {claimed.status === 'SHIPPED' ? <Truck size={16} className="text-emerald-500" /> : <CheckCircle size={16} />}
                                        STATUS: {claimed.status}
                                    </div>
                                ) : isUnlocked ? (
                                    <ClaimRewardButton reward={reward} />
                                ) : (
                                    <button disabled className="w-full py-3 rounded-xl bg-gray-800 text-gray-500 font-bold cursor-not-allowed">
                                        ZABLOKOWANE
                                    </button>
                                )}
                            </div>
                        </GlassCard>
                    );
                })}
            </div>
        </div>
    );
}
