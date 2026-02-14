'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    Package,
    Menu,
    X
} from "lucide-react";
import { AdminActivitySidebar } from "@/components/admin/AdminActivitySidebar";

interface AdminLayoutShellProps {
    children: React.ReactNode;
}

export function AdminLayoutShell({ children }: AdminLayoutShellProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 relative">
            {/* Global Background Ambience */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                <div className="absolute -top-[500px] left-[-200px] w-[1000px] h-[1000px] bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-500px] right-[-200px] w-[1000px] h-[1000px] bg-purple-500/5 rounded-full blur-[120px]" />
                <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"
                    style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' }}
                />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* LEFT SIDEBAR */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-black/20 backdrop-blur-xl flex flex-col
                transform transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1)
                md:fixed md:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-emerald-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
                            P
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white">
                            PayForLink<span className="text-emerald-500 text-[10px] ml-1 align-top">ADMIN</span>
                        </span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-zinc-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-hide py-2">
                    {/* Main Group */}
                    <div className="space-y-1">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2">Główne</div>
                        <AdminNavItem href="/admin" icon={<LayoutDashboard size={18} />} onClick={() => setIsMobileMenuOpen(false)}>Przegląd</AdminNavItem>
                        <AdminNavItem href="/admin/live" icon={<Monitor size={18} />} onClick={() => setIsMobileMenuOpen(false)}>Ruch Na Żywo</AdminNavItem>
                    </div>

                    {/* Management Group */}
                    <div className="space-y-1">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2">Zarządzanie</div>
                        <AdminNavItem href="/admin/users" icon={<Users size={18} />} onClick={() => setIsMobileMenuOpen(false)}>Użytkownicy</AdminNavItem>
                        <AdminNavItem href="/admin/payouts" icon={<Wallet size={18} />} onClick={() => setIsMobileMenuOpen(false)}>Wypłaty</AdminNavItem>
                        <AdminNavItem href="/admin/calculator" icon={<Activity size={18} />} onClick={() => setIsMobileMenuOpen(false)}>Kalkulator</AdminNavItem>
                        <AdminNavItem href="/admin/rewards" icon={<Package size={18} />} onClick={() => setIsMobileMenuOpen(false)}>Nagrody</AdminNavItem>
                        <AdminNavItem href="/settings" icon={<Settings size={18} />} onClick={() => setIsMobileMenuOpen(false)}>Ustawienia</AdminNavItem>
                    </div>

                    {/* Security Group */}
                    <div className="space-y-1">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2">Bezpieczeństwo</div>
                        <AdminNavItem href="/admin/fraud" icon={<ShieldAlert size={18} />} activeClassName="text-red-400 bg-red-500/10 border-red-500/20" onClick={() => setIsMobileMenuOpen(false)}>Alerty Oszustw</AdminNavItem>
                    </div>
                </div>

                <div className="p-4 border-t border-white/5 mt-auto">
                    <Link href="/dashboard" className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors w-full px-3 py-2 rounded-lg hover:bg-white/5 text-sm font-medium">
                        <LogOut size={18} />
                        <span>Wyjdź z Admina</span>
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative z-0 transition-all duration-300">
                {/* Top Header */}
                <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-zinc-500 hover:text-white">
                            <Menu size={24} />
                        </button>

                        <div className="relative group hidden md:block w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Szukaj..."
                                className="w-full bg-white/[0.03] border border-white/5 rounded-full pl-10 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all placeholder:text-zinc-600"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
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
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden min-w-0">
                    {children}
                </main>
            </div>

            {/* RIGHT SIDEBAR (Desktop Only for now, maybe add mobile toggle later) */}
            <AdminActivitySidebar />
            {/* Spacer for Right Sidebar on desktop */}
            <div className="hidden xl:block w-80 flex-shrink-0" />
        </div>
    );
}

function AdminNavItem({ href, icon, children, activeClassName, onClick }: { href: string, icon: React.ReactNode, children: React.ReactNode, activeClassName?: string, onClick?: () => void }) {
    const pathname = usePathname();
    const isActive = href === '/admin' ? pathname === href : pathname.startsWith(href);

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative text-sm font-medium border ${isActive
                    ? activeClassName || 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border-transparent'
                }`}
        >
            <span className={`transition-colors ${isActive ? '' : 'group-hover:text-white'}`}>{icon}</span>
            <span>{children}</span>
        </Link>
    )
}
