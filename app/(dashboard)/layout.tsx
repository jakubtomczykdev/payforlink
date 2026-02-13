'use client';

import Link from "next/link"
import { usePathname } from "next/navigation";
import { LayoutDashboard, Link as LinkIcon, Settings, LogOut, Wallet, Menu, X, Trophy } from "lucide-react"
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

import { NotificationBell } from "@/components/dashboard/NotificationBell";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 relative">
            {/* Global Background Ambience */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Subtle Grain */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

                {/* Subtle Gradients - Adjusted for dashboard layout */}
                <div className="absolute -top-[500px] left-[-200px] w-[1000px] h-[1000px] bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-500px] right-[-200px] w-[1000px] h-[1000px] bg-purple-500/5 rounded-full blur-[120px]" />

                {/* Grid Pattern */}
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

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-black/20 backdrop-blur-xl p-6 
                transform transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1)
                md:relative md:translate-x-0 md:flex md:flex-col
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-emerald-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
                            P
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">PayForLink</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 space-y-1">
                    <NavItem href="/dashboard" icon={<LayoutDashboard size={18} />} onClick={() => setIsMobileMenuOpen(false)}>Przegląd</NavItem>
                    <NavItem href="/dashboard/links" icon={<LinkIcon size={18} />} onClick={() => setIsMobileMenuOpen(false)}>Moje Linki</NavItem>
                    <NavItem href="/dashboard/payouts" icon={<Wallet size={18} />} onClick={() => setIsMobileMenuOpen(false)}>Wypłaty</NavItem>
                    <NavItem href="/dashboard/rewards" icon={<Trophy size={18} />} onClick={() => setIsMobileMenuOpen(false)}>Nagrody</NavItem>
                    <NavItem href="/dashboard/settings" icon={<Settings size={18} />} onClick={() => setIsMobileMenuOpen(false)}>Ustawienia</NavItem>
                </nav>

                <div className="pt-6 border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-3 mb-6 px-3">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt={session.user.name || "User"} className="h-8 w-8 rounded-full border border-white/10" />
                        ) : (
                            <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                                {session?.user?.name?.charAt(0) || "U"}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white line-clamp-1">{session?.user?.name || 'User'}</span>
                            <span className="text-xs text-gray-500 line-clamp-1">{session?.user?.email}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-3 py-2 rounded-lg hover:bg-white/5 group text-sm"
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Wyloguj</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative z-10 bg-transparent">
                {/* Desktop Notification Bell (Absolute Position) */}
                <div className="absolute top-6 right-8 z-50 hidden md:block">
                    <NotificationBell />
                </div>

                <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-md sticky top-0 z-10 shrink-0 md:hidden">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-gray-400">
                            <Menu size={24} />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-200">Dashboard</h1>
                    </div>
                    {/* Mobile Notification Bell */}
                    <div>
                        <NotificationBell />
                    </div>
                </header>
                <div className="p-6 md:p-8 flex-1 overflow-y-auto scrollbar-hide">
                    {children}
                </div>
            </main>
        </div>
    )
}

function NavItem({ href, icon, children, onClick }: { href: string, icon: React.ReactNode, children: React.ReactNode, onClick?: () => void }) {
    const pathname = usePathname();
    const isActive = href === '/dashboard' ? pathname === href : pathname.startsWith(href);

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative text-sm font-medium
            ${isActive
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
        >
            <span className={`relative z-10 ${isActive ? 'text-emerald-500' : 'text-zinc-400 group-hover:text-white'}`}>{icon}</span>
            <span className="relative z-10">{children}</span>
        </Link>
    )
}
