"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export const StickyCTA = () => {
    const { scrollY } = useScroll();
    const [isVisible, setIsVisible] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const heroHeight = 600; // Approx height of hero
        if (latest > heroHeight) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    });

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{
                y: isVisible ? 0 : 100,
                opacity: isVisible ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-0 right-0 z-50 px-4 md:hidden pointer-events-none"
        >
            <div className="bg-zinc-900/90 backdrop-blur-lg border border-emerald-500/20 rounded-2xl p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4 pointer-events-auto">
                <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">Zacznij zarabiać</span>
                    <span className="text-emerald-400 text-xs">Darmowe konto w 30s</span>
                </div>
                <Link
                    href="/register"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2"
                >
                    Dołącz
                    <ArrowRight size={16} />
                </Link>
            </div>
        </motion.div>
    );
};
