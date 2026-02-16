import { GlassCard } from "@/components/ui/GlassCard";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { requestPayout } from "@/app/actions/payout";

export default async function PayoutsPage() {
    const session = await auth();
    if (!session || !session.user?.email) redirect("/api/auth/signin");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            payouts: {
                orderBy: { requestedAt: 'desc' }
            }
        }
    });

    if (!user) return null;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Wypłaty</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <GlassCard gradient className="p-8">
                    <div className="text-sm text-emerald-400 font-medium mb-2 uppercase tracking-wider">Dostępne Środki</div>
                    <div className="text-5xl font-bold text-white mb-6">
                        {user.walletBalance.toFixed(2)} <span className="text-2xl text-gray-400">PLN</span>
                    </div>

                    <form action={async (formData) => {
                        'use server';
                        await requestPayout(formData);
                    }} className="space-y-4">
                        <input type="hidden" name="amount" value={user.walletBalance} />

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Wybierz Metodę Wypłaty</label>
                            <select name="method" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500/50">
                                <option value="BANK">Przelew Bankowy {user.bankAccount ? `(Kończy się na ...${user.bankAccount.slice(-4)})` : '(Nie ustawiono)'}</option>
                                <option value="USDT">USDT (TRC20) {user.usdtAddress ? `(Kończy się na ...${user.usdtAddress.slice(-4)})` : '(Nie ustawiono)'}</option>
                                <option value="BLIK">BLIK {user.blikNumber ? `(${user.blikNumber})` : '(Nie ustawiono)'}</option>
                            </select>
                        </div>

                        <button
                            disabled={user.walletBalance < 20}
                            className="w-full bg-white text-black font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                        >
                            {user.walletBalance < 20 ? 'Minimum 20 PLN do wypłaty' : 'Wypłać Całość'}
                        </button>
                    </form>
                </GlassCard>

                <GlassCard className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Informacje o Wypłatach</h3>
                    <div className="space-y-4 text-sm text-gray-400">
                        <p>• Wypłaty są przetwarzane ręcznie w ciągu 24-48 godzin.</p>
                        <p>• Minimalna kwota wypłaty to 20 PLN.</p>
                        <p>• Obecnie obsługiwane metody: Przelew Bankowy, PayPal, USDT.</p>
                    </div>
                </GlassCard>
            </div>

            <h2 className="text-xl font-bold text-white pt-4">Historia Transakcji</h2>
            <div className="space-y-3">
                {user.payouts.map((payout: any) => (
                    <GlassCard key={payout.id} className="p-4 flex items-center justify-between group hover:bg-white/5">
                        <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${payout.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' :
                                payout.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                                    'bg-red-500/10 text-red-500'
                                }`}>
                                {payout.status === 'COMPLETED' ? <CheckCircle size={20} /> :
                                    payout.status === 'PENDING' ? <Clock size={20} /> :
                                        <XCircle size={20} />}
                            </div>
                            <div>
                                <div className="font-bold text-white">{payout.amount.toFixed(2)} PLN</div>
                                <div className="text-xs text-gray-500">{payout.requestedAt.toLocaleDateString()}</div>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${payout.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' :
                            payout.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                                'bg-red-500/10 text-red-500'
                            }`}>
                            {payout.status}
                        </span>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
