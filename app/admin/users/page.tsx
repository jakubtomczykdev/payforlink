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
                    <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        Zarządzanie Użytkownikami <span className="text-gray-600 text-lg font-normal">/</span> <span className="text-gray-400 text-base font-normal">Lista</span>
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Zarządzaj kontami, uprawnieniami i statusem.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-widest rounded-lg transition-colors shadow-lg shadow-emerald-500/20">
                        Dodaj Użytkownika
                    </button>
                </div>
            </div>

            <div className="grid gap-3">
                {users.map((user: any) => (
                    <GlassCard key={user.id} className="p-4 flex items-center justify-between group hover:bg-[#09090B]/80 hover:border-white/20 transition-all border-white/5 bg-[#09090B]/40">
                        <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border font-bold text-sm ${user.role === 'ADMIN'
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                : 'bg-white/5 text-gray-400 border-white/10'
                                }`}>
                                {user.role === 'ADMIN' ? 'AD' : user.email.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-bold text-white text-sm flex items-center gap-2">
                                    {user.email}
                                    {user.isBanned && (
                                        <span className="text-[9px] bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded border border-red-500/20 font-black tracking-wider">ZBANOWANY</span>
                                    )}
                                </div>
                                <div className="text-[10px] text-gray-500 font-mono mt-0.5 flex items-center gap-2">
                                    ID: {user.id.substring(0, 8)}... • Dołączył {formatDistanceToNow(user.createdAt, { addSuffix: true, locale: pl })}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="hidden md:block text-right">
                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-0.5">Linków</div>
                                <div className="text-sm font-bold text-white">{user._count.links}</div>
                            </div>

                            <div className="hidden md:block text-right">
                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-0.5">Saldo</div>
                                <div className="text-sm font-bold text-emerald-400">{user.walletBalance.toFixed(2)} {user.currency}</div>
                            </div>

                            <div className="flex items-center gap-2 pl-4 border-l border-white/5">
                                <Link href={`/admin/users/${user.id}/quality`} className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Raport Jakości">
                                    <Activity size={18} />
                                </Link>
                                <Link href={`/admin/users/${user.id}`} className="group/btn flex items-center gap-1 pl-3 pr-2 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white transition-all">
                                    Szczegóły <ChevronRight size={14} className="text-gray-500 group-hover/btn:text-white transition-colors" />
                                </Link>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
