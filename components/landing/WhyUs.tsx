"use client";

import { motion, useScroll, useMotionValueEvent, useSpring } from "framer-motion";
import { Zap, ShieldCheck, BarChart3, Wallet, CheckCircle } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
const VisualWrapper = ({ active, children }: { active: boolean; children: React.ReactNode }) => (
    <motion.div
        initial={false}
        animate={{
            opacity: active ? 1 : 0,
            scale: active ? 1 : 0.95,
            y: active ? 0 : 20,
            filter: active ? "blur(0px)" : "blur(10px)",
        }}
        transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1], // Custom Apple-like ease
        }}
        style={{
            willChange: "transform, opacity",
            backfaceVisibility: "hidden"
        }}
        className={cn(
            "absolute inset-0 flex items-center justify-center",
            active ? "pointer-events-auto" : "pointer-events-none"
        )}
    >
        {children}
    </motion.div>
);

// --- VISUAL COMPONENTS (Zoptymalizowane) ---

const InstantPayoutsVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 bg-zinc-900 border border-emerald-500/20 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_50px_rgba(16,185,129,0.1)]"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="text-zinc-400 text-sm font-medium">Available Balance</div>
                <Wallet className="text-emerald-500 w-5 h-5" />
            </div>
            <div className="text-4xl font-bold text-white mb-2 tracking-tight">2,450.00 PLN</div>
            <div className="flex items-center gap-2 text-sm text-emerald-400 mb-8">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Ready for withdrawal
            </div>
            <button className="h-12 w-full bg-emerald-600 hover:bg-emerald-500 transition-all rounded-xl flex items-center justify-center font-semibold text-black active:scale-95">
                Withdraw Funds
            </button>
        </motion.div>
    </div>
);

const AnalyticsVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
        <div className="relative z-10 w-full max-w-sm space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl">
                <div className="flex justify-between items-end h-32 gap-2">
                    {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: i * 0.05, duration: 0.8, ease: "circOut" }}
                            className="w-full bg-gradient-to-t from-blue-600/40 to-blue-400/20 rounded-t-md relative group"
                        />
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 font-bold">Total Clicks</div>
                    <div className="text-2xl font-bold text-white">12,402</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 font-bold">Avg. CPM</div>
                    <div className="text-2xl font-bold text-blue-400">$12.50</div>
                </div>
            </div>
        </div>
    </div>
);

const SecurityVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center p-8">
        <div className="relative z-10 bg-zinc-900/50 backdrop-blur-xl border border-purple-500/20 rounded-full w-64 h-64 flex items-center justify-center shadow-2xl">
            <ShieldCheck className="w-20 h-20 text-purple-500" />
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-purple-500/40"
            />
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-zinc-900 rounded-full border border-zinc-800 p-3 shadow-2xl"
            >
                <CheckCircle className="w-6 h-6 text-emerald-500" />
            </motion.div>
        </div>
    </div>
);

// --- DATA ---

const FEATURES_DATA = [
    {
        title: "Instant Payouts",
        description: "Withdraw your earnings as soon as you reach 20 PLN. We support Bank Transfer, PayPal, and Crypto. Money in your account within 24 hours.",
        icon: Zap,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        visual: <InstantPayoutsVisual />
    },
    {
        title: "Real-time Analytics",
        description: "Detailed insights on clicks, location, and device type. Track your performance with precision via our live dashboard.",
        icon: BarChart3,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        visual: <AnalyticsVisual />
    },
    {
        title: "Anti-Fraud Security",
        description: "Advanced AI protection against bot traffic and invalid clicks. Only high-quality traffic counts towards your balance.",
        icon: ShieldCheck,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        visual: <SecurityVisual />
    }
];

export const WhyUs = () => {
    const containerRef = useRef<HTMLElement>(null);
    const [activeCard, setActiveCard] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Dodajemy spring do scrolla, aby wygładzić przeskoki między kartami
    const smoothProgress = useSpring(scrollYProgress, {
        damping: 30,
        stiffness: 200,
    });

    useMotionValueEvent(smoothProgress, "change", (latest) => {
        if (latest < 0.3) setActiveCard(0);
        else if (latest < 0.6) setActiveCard(1);
        else setActiveCard(2);
    });

    return (
        <section ref={containerRef} className="h-[400vh] relative bg-zinc-950"> {/* Zwiększone do 400vh dla płynniejszego przejścia */}
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">

                {/* Optymalizacja tła - jeden div zmieniający kolor zamiast wielu */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none transition-colors duration-1000 opacity-20"
                    style={{
                        backgroundColor:
                            activeCard === 0 ? "#10b981" :
                                activeCard === 1 ? "#3b82f6" : "#a855f7"
                    }}
                />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Left Content */}
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-6xl font-bold mb-16 text-white tracking-tighter">
                                Dlaczego twórcy <br />
                                <span className="text-zinc-600">wybierają nas</span>
                            </h2>

                            <div className="relative space-y-4">
                                {FEATURES_DATA.map((feature, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setActiveCard(index)}
                                        className={cn(
                                            "group relative transition-all duration-700 border-l-2 pl-8 py-6 cursor-pointer",
                                            activeCard === index
                                                ? "border-emerald-500 bg-emerald-500/5"
                                                : "border-zinc-900 opacity-20 hover:opacity-40"
                                        )}
                                    >
                                        <div className="flex items-center gap-4 mb-2">
                                            <feature.icon className={cn("w-6 h-6", activeCard === index ? feature.color : "text-zinc-500")} />
                                            <h3 className="text-2xl font-bold text-white tracking-tight">
                                                {feature.title}
                                            </h3>
                                        </div>
                                        <p className="text-zinc-400 text-lg leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Visuals - Zoptymalizowany Stack */}
                        <div className="hidden lg:block relative h-[500px] w-full">
                            <VisualWrapper active={activeCard === 0}>
                                <InstantPayoutsVisual />
                            </VisualWrapper>

                            <VisualWrapper active={activeCard === 1}>
                                <AnalyticsVisual />
                            </VisualWrapper>

                            <VisualWrapper active={activeCard === 2}>
                                <SecurityVisual />
                            </VisualWrapper>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};