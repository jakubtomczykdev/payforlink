import { GlassCard } from "@/components/ui/GlassCard";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { Search, MoreVertical, Shield, User, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { links: true, payouts: true }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                        Lista Użytkowników
                    </h1>
                    <p className="text-zinc-400 text-sm">Zarządzaj kontami, uprawnieniami i statusem.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-emerald-500/20">
                        Dodaj Użytkownika
                    </button>
                </div>
            </div>

            <GlassCard className="p-0 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider bg-white/[0.02] border-b border-white/5">
                    <div className="col-span-5">Użytkownik</div>
                    <div className="col-span-2 text-right hidden md:block">Linki</div>
                    <div className="col-span-3 text-right hidden md:block">Saldo</div>
                    <div className="col-span-2 text-right">Akcje</div>
                </div>

                <div className="divide-y divide-white/5">
                    {users.map((user: any) => (
                        <div key={user.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group">
                            <div className="col-span-5 flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${user.role === 'ADMIN'
                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                    : 'bg-zinc-800 text-zinc-400 border border-white/5'
                                    }`}>
                                    {user.role === 'ADMIN' ? 'AD' : user.email.substring(0, 1).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-medium text-zinc-200 text-sm truncate flex items-center gap-2">
                                        {user.email}
                                        {user.isBanned && (
                                            <span className="text-[9px] bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded border border-red-500/20 font-bold">BAN</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-zinc-500 truncate">
                                        ID: {user.id.substring(0, 8)}...
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 text-right hidden md:block">
                                <span className="text-sm font-mono text-zinc-400">{user._count.links}</span>
                            </div>

                            <div className="col-span-3 text-right hidden md:block">
                                <span className="text-sm font-mono text-emerald-500 font-medium">{user.walletBalance.toFixed(2)} PLN</span>
                            </div>

                            <div className="col-span-2 flex items-center justify-end gap-2">
                                <Link href={`/admin/users/${user.id}`} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                    <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}
