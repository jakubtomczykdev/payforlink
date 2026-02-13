"use client";

import Link from "next/link";
import { Link2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? "bg-[#0B0B0B]/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                        <Link2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">PayForLink</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        Funkcje
                    </Link>
                    <Link href="#payouts" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        Wypłaty
                    </Link>
                    <Link href="/faq" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        FAQ
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-zinc-300 hover:text-white transition-colors hidden md:block"
                    >
                        Zaloguj się
                    </Link>
                    <Link
                        href="/register"
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                    >
                        Zacznij Teraz
                    </Link>
                </div>
            </div>
        </nav>
    );
};
