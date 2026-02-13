import { auth } from "@/auth";
import { GlassCard } from "@/components/ui/GlassCard";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
    LayoutDashboard,
    Users,
    Wallet,
    ShieldAlert,
    LogOut,
    Monitor,
    Search,
    Bell,
    Settings,
    Activity,
    Calendar,
    ChevronRight,
    Zap,
    Package
} from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth();

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    // Double check role in DB to be safe
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
        redirect("/dashboard"); // Kick non-admins back to user dashboard
    }

    return (
        <div className="flex min-h-screen bg-[#09090B] text-white font-sans selection:bg-emerald-500/30 overflow-hidden">
            {/* LEFT SIDEBAR */}
            <aside className="w-64 border-r border-white/[0.08] bg-[#09090B]/95 flex flex-col fixed inset-y-0 z-50">
                <div className="p-6 flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-tr from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center font-black text-black text-xl shadow-lg shadow-emerald-500/20">
                        GL
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                        Glitchy<span className="text-emerald-500">Admin</span>
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-4 space-y-8 scrollbar-hide">
                    {/* Main Group */}
                    <div className="space-y-2">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">Główne</div>
                        <AdminNavItem href="/admin" icon={<LayoutDashboard size={18} />}>Przegląd</AdminNavItem>
                        <AdminNavItem href="/admin/live" icon={<Monitor size={18} />}>Ruch Na Żywo</AdminNavItem>
                    </div>

                    {/* Management Group */}
                    <div className="space-y-2">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">Zarządzanie</div>
                        <AdminNavItem href="/admin/users" icon={<Users size={18} />}>Użytkownicy i Jakość</AdminNavItem>
                        <AdminNavItem href="/admin/payouts" icon={<Wallet size={18} />}>Wypłaty i Rozliczenia</AdminNavItem>
                        <AdminNavItem href="/admin/calculator" icon={<Activity size={18} />}>Kalkulator Zysków</AdminNavItem>
                        <AdminNavItem href="/admin/rewards" icon={<Package size={18} />}>Nagrody</AdminNavItem>
                        <AdminNavItem href="/settings" icon={<Settings size={18} />}>Ustawienia</AdminNavItem>
                    </div>

                    {/* Security Group */}
                    <div className="space-y-2">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">Bezpieczeństwo</div>
                        <AdminNavItem href="/admin/fraud" icon={<ShieldAlert size={18} />} activeClassName="text-red-400 bg-red-500/10">Alerty Oszustw</AdminNavItem>
                    </div>
                </div>

                <div className="p-4 border-t border-white/[0.08]">
                    <Link href="/dashboard" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-3 py-2 rounded-lg hover:bg-white/5">
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Wyjdź z Admina</span>
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative z-0">
                {/* Top Header */}
                <header className="h-16 border-b border-white/[0.08] bg-[#09090B]/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4 w-96">
                        <div className="relative w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Szukaj użytkowników, transakcji lub IP..."
                                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-full pl-10 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wide">System Optymalny</span>
                        </div>
                        <button className="text-gray-400 hover:text-white transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#09090B]" />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/10" />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* RIGHT SIDEBAR (Desktop Only) */}
            <aside className="w-80 border-l border-white/[0.08] bg-[#09090B]/95 hidden xl:flex flex-col fixed right-0 inset-y-0 z-50">
                <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Kanał Aktywności</h3>
                    <Activity size={16} className="text-emerald-500" />
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors cursor-pointer group">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                                <Zap size={16} />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-white mb-1">Nowy Ruch o Wysokiej Wartości</div>
                                <div className="text-[10px] text-gray-500 leading-relaxed">
                                    Nieoczekiwany wzrost ruchu z <b>Stanów Zjednoczonych</b>.
                                </div>
                                <div className="text-[10px] text-gray-600 mt-2 font-mono">2 min temu</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors cursor-pointer group">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-black transition-colors">
                                <Users size={16} />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-white mb-1">Nowa Rejestracja Użytkownika</div>
                                <div className="text-[10px] text-gray-500 leading-relaxed">
                                    Użytkownik <b>alex.g@example.com</b> dołączył do platformy.
                                </div>
                                <div className="text-[10px] text-gray-600 mt-2 font-mono">15 min temu</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors cursor-pointer group">
                            <div className="p-2 rounded-lg bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-black transition-colors">
                                <ShieldAlert size={16} />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-white mb-1">Zablokowano Próbę Oszustwa</div>
                                <div className="text-[10px] text-gray-500 leading-relaxed">
                                    System automatycznie zbanował IP <b>192.168.x.x</b> za użycie proxy.
                                </div>
                                <div className="text-[10px] text-gray-600 mt-2 font-mono">1 godz. temu</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/[0.08]">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar size={16} className="text-emerald-500" />
                            <span className="text-xs font-bold text-white">Kalendarz Systemowy</span>
                        </div>
                        <div className="text-2xl font-black text-white">30</div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest">Piątek, Sty 2026</div>
                    </div>
                </div>
            </aside>
            {/* Spacer for Right Sidebar on desktop */}
            <div className="hidden xl:block w-80 flex-shrink-0" />
        </div>
    );
}

function AdminNavItem({ href, icon, children, activeClassName }: { href: string, icon: React.ReactNode, children: React.ReactNode, activeClassName?: string }) {
    return (
        <Link href={href} className={`flex items-center gap-3 px-3 py-2.5 text-gray-400 rounded-lg hover:bg-white/[0.05] hover:text-white transition-all group ${activeClassName}`}>
            <span className="group-hover:scale-110 transition-transform group-hover:text-emerald-400">{icon}</span>
            <span className="font-medium text-sm">{children}</span>
        </Link>
    )
}
