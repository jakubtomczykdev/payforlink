import { GlassCard } from "@/components/ui/GlassCard";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { CheckCircle, XCircle, AlertCircle, History, Wallet, ArrowRight, CornerDownRight } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminPayoutsPage() {
    const pendingPayouts = await prisma.payout.findMany({
        where: { status: 'PENDING' },
        include: { user: true },
        orderBy: { requestedAt: 'asc' }
    });

    const recentPayouts = await prisma.payout.findMany({
        where: { status: { not: 'PENDING' } },
        include: { user: true },
        orderBy: { processedAt: 'desc' },
        take: 10
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                        Wypłaty
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">FINANSE</span>
                    </h1>
                    <p className="text-zinc-400 text-sm">Zarządzaj wnioskami o wypłatę środków.</p>
                </div>
            </div>

            <div className="grid gap-8">
                {/* Pending Payouts Section */}
                <section className="space-y-4">
                    <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 px-1">
                        <AlertCircle size={14} className="text-yellow-500" /> Oczekujące Wnioski
                    </h2>
                    {pendingPayouts.length === 0 ? (
                        <GlassCard className="p-12 text-center text-zinc-500 border-dashed border-white/5 bg-transparent">
                            <CheckCircle className="mx-auto h-12 w-12 mb-4 opacity-20 text-emerald-500" />
                            <p className="text-sm">Brak oczekujących wypłat.</p>
                        </GlassCard>
                    ) : (
                        <div className="grid gap-4">
                            {pendingPayouts.map((payout: any) => (
                                <GlassCard key={payout.id} className="p-6 group border-l-4 border-l-yellow-500/50">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold border border-emerald-500/20 text-lg">
                                                {payout.user.email?.[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-xl tracking-tight">{payout.amount.toFixed(2)} PLN</div>
                                                <div className="text-sm text-zinc-400 flex items-center gap-2">
                                                    <span className="text-white font-medium">{payout.user.email}</span>
                                                    <span className="text-zinc-600">•</span>
                                                    <span>{formatDistanceToNow(payout.requestedAt, { addSuffix: true, locale: pl })}</span>
                                                </div>
                                                <div className="text-[10px] text-zinc-500 mt-1 uppercase font-bold flex items-center gap-1.5 tracking-widest">
                                                    Metoda: {payout.method}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <form action={async (formData) => {
                                                'use server';
                                                const adminNotes = formData.get('adminNotes') as string;
                                                await prisma.payout.update({
                                                    where: { id: payout.id },
                                                    data: { status: 'REJECTED', processedAt: new Date(), adminNotes }
                                                });
                                                await prisma.user.update({
                                                    where: { id: payout.userId },
                                                    data: { walletBalance: { increment: payout.amount } }
                                                });
                                                revalidatePath('/admin/payouts');
                                            }} className="flex gap-2">
                                                <input
                                                    name="adminNotes"
                                                    placeholder="Powód..."
                                                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500/50 w-32 lg:w-48 transition-all placeholder:text-zinc-600"
                                                />
                                                <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-xs uppercase tracking-wider border border-red-500/20">
                                                    <XCircle size={14} /> Odrzuć
                                                </button>
                                            </form>

                                            <form action={async (formData) => {
                                                'use server';
                                                const adminNotes = formData.get('adminNotes') as string;
                                                await prisma.payout.update({
                                                    where: { id: payout.id },
                                                    data: { status: 'PROCESSED', processedAt: new Date(), adminNotes }
                                                });
                                                revalidatePath('/admin/payouts');
                                            }} className="flex gap-2">
                                                <input
                                                    name="adminNotes"
                                                    placeholder="Notatki / TXID..."
                                                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 w-32 lg:w-48 transition-all placeholder:text-zinc-600"
                                                />
                                                <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 transition-all font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20">
                                                    <CheckCircle size={14} /> Zatwierdź
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    {payout.user.usdtAddress && payout.method === 'USDT' && (
                                        <div className="mt-4 p-3 bg-black/20 rounded-lg border border-white/5 flex items-center gap-2">
                                            <CornerDownRight size={14} className="text-zinc-500" />
                                            <span className="text-[10px] text-zinc-500 uppercase font-bold">Adres:</span>
                                            <span className="text-xs font-mono text-emerald-400 break-all select-all">{payout.user.usdtAddress}</span>
                                        </div>
                                    )}
                                    {payout.user.bankAccount && (
                                        <div className="mt-4 p-3 bg-black/20 rounded-lg border border-white/5 flex items-center gap-2">
                                            <CornerDownRight size={14} className="text-zinc-500" />
                                            <span className="text-[10px] text-zinc-500 uppercase font-bold">IBAN:</span>
                                            <span className="text-xs font-mono text-blue-400 break-all select-all">{payout.user.bankAccount}</span>
                                        </div>
                                    )}
                                    {payout.user.blikNumber && payout.method === 'BLIK' && (
                                        <div className="mt-4 p-3 bg-black/20 rounded-lg border border-white/5 flex items-center gap-2">
                                            <CornerDownRight size={14} className="text-zinc-500" />
                                            <span className="text-[10px] text-zinc-500 uppercase font-bold">BLIK:</span>
                                            <span className="text-xs font-mono text-orange-400 break-all select-all">{payout.user.blikNumber}</span>
                                        </div>
                                    )}
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </section>

                {/* History Section */}
                <section className="space-y-4 pb-12">
                    <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 px-1">
                        <History size={14} /> Ostatnia Historia
                    </h2>
                    <GlassCard className="overflow-hidden p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-[10px] text-zinc-500 uppercase font-semibold bg-white/[0.02] border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Użytkownik</th>
                                        <th className="px-6 py-4">Kwota</th>
                                        <th className="px-6 py-4">Przetworzono</th>
                                        <th className="px-6 py-4">Notatki</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {recentPayouts.map((p) => (
                                        <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold border ${p.status === 'PROCESSED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                    }`}>
                                                    {p.status === 'PROCESSED' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                                    {p.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-300 font-medium">{p.user.email}</td>
                                            <td className="px-6 py-4 text-zinc-200 font-mono">{p.amount.toFixed(2)} PLN</td>
                                            <td className="px-6 py-4 text-zinc-500 text-xs">
                                                {p.processedAt ? formatDistanceToNow(p.processedAt, { addSuffix: true, locale: pl }) : 'N/D'}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-500 text-xs max-w-xs truncate" title={p.adminNotes || ''}>
                                                {p.adminNotes || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                    {recentPayouts.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 italic">Brak przetworzonych wypłat.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </section>
            </div>
        </div>
    );
}
