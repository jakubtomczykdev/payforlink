import { GlassCard } from "@/components/ui/GlassCard";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { User, Activity, DollarSign, ShieldAlert, CheckCircle, Ban, ArrowLeft, Calendar, CreditCard, Wallet } from "lucide-react";
import Link from "next/link";
import { banUser, unbanUser, adjustBalance } from "./actions";
import { format } from "date-fns";

export default async function AdminUserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            links: { orderBy: { createdAt: 'desc' }, take: 5 },
            payouts: { orderBy: { requestedAt: 'desc' }, take: 5 }
        }
    });

    if (!user) return notFound();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <Link href="/admin/users" className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-transparent hover:border-white/10">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                        {user.email}
                        {user.isBanned && (
                            <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-wider border border-red-500/20">BANNED</span>
                        )}
                        {user.role === 'ADMIN' && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">ADMIN</span>
                        )}
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5 font-mono">ID: {user.id}</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Card */}
                <GlassCard gradient className="p-6 md:col-span-1 space-y-6 h-fit bg-[#09090B]/60">
                    <div className="flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center text-4xl font-bold text-white border border-white/10 shadow-xl mb-4">
                            {user.email[0].toUpperCase()}
                        </div>
                        <div className="text-lg font-bold text-white">{user.name || 'No Name'}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                            <Calendar size={12} /> Joined {format(user.createdAt, 'dd.MM.yyyy')}
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/5">
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center gap-2">
                                <Activity size={12} /> Bank Account
                            </div>
                            <div className="text-sm font-mono text-white break-all select-all">{user.bankAccount || 'Not set'}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center gap-2">
                                <CreditCard size={12} /> USDT Address
                            </div>
                            <div className="text-sm font-mono text-white break-all select-all">{user.usdtAddress || 'Not set'}</div>
                        </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-3">
                        {user.isBanned ? (
                            <form action={unbanUser.bind(null, user.id)}>
                                <button className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 text-xs uppercase tracking-widest">
                                    Unban User Account
                                </button>
                            </form>
                        ) : (
                            <form action={banUser.bind(null, user.id)}>
                                <button className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-bold transition-all text-xs uppercase tracking-widest">
                                    Ban User Account
                                </button>
                            </form>
                        )}
                        <Link href={`/admin/users/${user.id}/quality`} className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold transition-all text-xs uppercase tracking-widest text-center block">
                            View Quality Report
                        </Link>
                    </div>
                </GlassCard>

                {/* Actions & Stats */}
                <div className="md:col-span-2 space-y-6">
                    <GlassCard className="p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Wallet size={120} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            Wallet Management
                        </h3>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="text-5xl font-black text-white tracking-tighter">
                                {user.walletBalance.toFixed(2)} <span className="text-2xl text-emerald-500">PLN</span>
                            </div>
                        </div>

                        <form action={adjustBalance.bind(null, user.id)} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="md:col-span-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Amount (+/-)</label>
                                <input name="amount" type="number" step="0.01" placeholder="0.00" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 transition-colors font-mono" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Adjustment Reason</label>
                                <input name="reason" type="text" placeholder="e.g. Bonus, Correction, Refund" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 transition-colors" />
                            </div>
                            <button className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-xl font-bold transition-colors shadow-lg text-sm md:col-span-1 h-[46px]">
                                Apply
                            </button>
                        </form>
                    </GlassCard>

                    <GlassCard className="p-0 overflow-hidden">
                        <div className="p-4 border-b border-white/5 bg-white/[0.02] font-bold text-gray-400 text-xs uppercase tracking-widest flex justify-between items-center">
                            <span>Recent Payouts</span>
                            {user.payouts.length > 0 && <Link href="/admin/payouts" className="text-[10px] text-emerald-500 hover:underline">View All</Link>}
                        </div>
                        <div className="divide-y divide-white/5">
                            {user.payouts.length === 0 && <div className="p-8 text-center text-gray-500 text-sm italic">No payout history available.</div>}
                            {user.payouts.map((p: any) => (
                                <div key={p.id} className="p-4 flex justify-between items-center text-sm hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${p.status === 'PROCESSED' ? 'bg-emerald-500/10 text-emerald-500' :
                                            p.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                            <DollarSign size={16} />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold">{p.amount.toFixed(2)} PLN</div>
                                            <div className="text-[10px] text-gray-500 font-mono">{format(p.requestedAt, 'dd.MM.yyyy')}</div>
                                        </div>
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${p.status === 'PROCESSED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                        p.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                        }`}>
                                        {p.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
