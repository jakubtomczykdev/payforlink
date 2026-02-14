import { auth } from "@/auth";
import { GlassCard } from "@/components/ui/GlassCard";
import { AdminActivitySidebar } from "@/components/admin/AdminActivitySidebar";
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
        <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 relative">
            {/* Global Background Ambience (Copied from Dashboard) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Subtle Grain */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

                {/* Subtle Gradients - Adjusted for admin layout (maybe slightly different hue to distinguish?) */}
                {/* Keeping it consistent for now */}
                <div className="absolute -top-[500px] left-[-200px] w-[1000px] h-[1000px] bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-500px] right-[-200px] w-[1000px] h-[1000px] bg-purple-500/5 rounded-full blur-[120px]" />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"
                    style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' }}
                />
            </div>

            {/* LEFT SIDEBAR */}
            <aside className="w-64 border-r border-white/5 bg-black/20 backdrop-blur-xl flex flex-col fixed inset-y-0 z-50">
                <div className="p-6 flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
                        P
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                        PayForLink<span className="text-emerald-500 text-xs ml-1 align-top">ADMIN</span>
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto px-4 space-y-8 scrollbar-hide py-4">
                    {/* Main Group */}
                    <div className="space-y-1">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2">Główne</div>
                        <AdminNavItem href="/admin" icon={<LayoutDashboard size={18} />}>Przegląd</AdminNavItem>
                        <AdminNavItem href="/admin/live" icon={<Monitor size={18} />}>Ruch Na Żywo</AdminNavItem>
                    </div>

                    {/* Management Group */}
                    <div className="space-y-1">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2">Zarządzanie</div>
                        <AdminNavItem href="/admin/users" icon={<Users size={18} />}>Użytkownicy</AdminNavItem>
                        <AdminNavItem href="/admin/payouts" icon={<Wallet size={18} />}>Wypłaty</AdminNavItem>
                        <AdminNavItem href="/admin/calculator" icon={<Activity size={18} />}>Kalkulator</AdminNavItem>
                        <AdminNavItem href="/admin/rewards" icon={<Package size={18} />}>Nagrody</AdminNavItem>
                        <AdminNavItem href="/settings" icon={<Settings size={18} />}>Ustawienia</AdminNavItem>
                    </div>

                    {/* Security Group */}
                    <div className="space-y-1">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2">Bezpieczeństwo</div>
                        <AdminNavItem href="/admin/fraud" icon={<ShieldAlert size={18} />} activeClassName="text-red-400 bg-red-500/10 border-red-500/20">Alerty Oszustw</AdminNavItem>
                    </div>
                </div>

                <div className="p-4 border-t border-white/5 mt-auto">
                    <Link href="/dashboard" className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors w-full px-3 py-2 rounded-lg hover:bg-white/5">
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Wyjdź z Admina</span>
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative z-0">
                {/* Top Header */}
                <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4 w-96">
                        <div className="relative w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Szukaj..."
                                className="w-full bg-white/[0.03] border border-white/5 rounded-full pl-10 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all placeholder:text-zinc-600"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">System Optymalny</span>
                        </div>
                        <button className="text-zinc-400 hover:text-white transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#05070a]" />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-medium text-zinc-400">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* RIGHT SIDEBAR (Desktop Only) */}
            <AdminActivitySidebar />
            {/* Spacer for Right Sidebar on desktop */}
            <div className="hidden xl:block w-80 flex-shrink-0" />
        </div>
    );
}

function AdminNavItem({ href, icon, children, activeClassName }: { href: string, icon: React.ReactNode, children: React.ReactNode, activeClassName?: string }) {
    // Basic implementation of active check - in a real app usePathname hook needed here or passed as prop, 
    // but preserving original structure if this component is server side rendered, although NavItems usually need client hooks.
    // The original code didn't use `usePathname`, suggesting it might be just relying on simple href matching or missing functionality.
    // Let's assume for now we just want the style.

    // Actually, 'AdminLayout' is async, so this is a Server Component. 
    // To properly highlight active links, we'd need a Client Component for navigation or accept pathname prop.
    // Since I can't easily switch the whole layout to client without impacts, I will stick to component style update.
    // However, the original dashboard uses `usePathname`.

    // For now, styling comparable to Dashboard NavItem:
    return (
        <Link href={href} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent ${activeClassName}`}>
            <span className="group-hover:text-white transition-colors">{icon}</span>
            <span>{children}</span>
        </Link>
    )
}
