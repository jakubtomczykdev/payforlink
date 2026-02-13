import { GlassCard } from "@/components/ui/GlassCard";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Save, AlertCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function SettingsPage() {
    const session = await auth();
    if (!session || !session.user?.email) redirect("/api/auth/signin");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) return null;

    async function updateSettings(formData: FormData) {
        'use server';
        const session = await auth();
        if (!session?.user?.email) return;

        const bankAccount = formData.get('bankAccount') as string;
        const usdtAddress = formData.get('usdtAddress') as string;

        await prisma.user.update({
            where: { email: session.user.email },
            data: { bankAccount, usdtAddress }
        });

        revalidatePath('/dashboard/settings');
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Ustawienia</h1>

            <GlassCard className="p-8 max-w-2xl">
                <div className="flex items-center gap-2 mb-6 text-emerald-500">
                    <Save size={24} />
                    <h2 className="text-xl font-bold text-white">Szczegóły Płatności</h2>
                </div>

                <form action={updateSettings} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Konto Bankowe (IBAN)</label>
                        <input
                            name="bankAccount"
                            defaultValue={user.bankAccount || ''}
                            placeholder="PL..."
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Adres USDT (TRC20)</label>
                        <input
                            name="usdtAddress"
                            defaultValue={user.usdtAddress || ''}
                            placeholder="T..."
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-yellow-500/80 max-w-[60%]">
                            <AlertCircle size={14} className="shrink-0" />
                            Proszę dokładnie sprawdzić swoje dane. Nieprawidłowe dane mogą prowadzić do utraty środków.
                        </div>
                        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                            Zapisz Zmiany
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
}
