"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Link2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export const Footer = () => {
    return (
        <footer className="bg-[#0B0B0B] border-t border-white/5 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* ... inside Footer ... */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Logo className="h-10 w-auto" />
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Usługa skracania linków premium zaprojektowana dla maksymalnej konwersji i generowania przychodów.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 tracking-tight">Produkt</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link href="#features" className="hover:text-emerald-500 transition-colors">Funkcje</Link></li>
                            <li><Link href="#payouts" className="hover:text-emerald-500 transition-colors">Stawki Wypłat</Link></li>
                            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Dokumentacja API</Link></li>
                            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Dowody Wypłat</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 tracking-tight">Prawne</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link href="/terms" className="hover:text-emerald-500 transition-colors">Regulamin</Link></li>
                            <li><Link href="/privacy" className="hover:text-emerald-500 transition-colors">Polityka Prywatności</Link></li>
                            <li><Link href="/cookies" className="hover:text-emerald-500 transition-colors">Polityka Cookies</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 tracking-tight">Połącz</h4>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all">
                                <Github className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all">
                                <Linkedin className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} PayForLink. Wszelkie prawa zastrzeżone.</p>
                    <p>Zaprojektowane dla Konwersji.</p>
                </div>
            </div>
        </footer>
    );
};
