"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Link as LinkIcon, Lock, Sparkles, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const QuickShorten = () => {
    const [url, setUrl] = useState("");
    const [showMockup, setShowMockup] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        setShowMockup(true);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText("payforlink.pl/x8s9d");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
            >
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-2 p-2 bg-zinc-900/60 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl ring-1 ring-white/5 group hover:ring-white/10 transition-all duration-300"
                >
                    <div className="relative flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-white/5">
                            <LinkIcon className="w-4 h-4 text-emerald-400" />
                        </div>
                        <Input
                            type="url"
                            placeholder="Paste your long link here..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="pl-14 h-14 bg-transparent border-transparent text-white placeholder:text-zinc-500 focus-visible:ring-0 text-lg rounded-xl transition-all"
                        />
                    </div>
                    <Button
                        type="submit"
                        size="lg"
                        className="h-14 px-8 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-base rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300"
                    >
                        Shorten
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </form>
            </motion.div>

            {/* Result Preview */}
            <AnimatePresence>
                {showMockup && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        className="overflow-hidden mt-4"
                    >
                        <div className="p-1 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-zinc-800/50 to-zinc-900/50 p-[1px]">
                            <div className="bg-zinc-950/90 backdrop-blur-md rounded-2xl p-4 border border-white/5 relative overflow-hidden">
                                {/* Decor */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -z-10" />

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                            <Sparkles className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div className="text-left">
                                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1 block">Monetized Link</span>
                                            <code className="text-lg text-white font-mono font-medium block">
                                                payforlink.pl/x8s9d
                                            </code>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={handleCopy}
                                            className={cn(
                                                "bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 min-w-[100px] transition-all",
                                                isCopied && "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                            )}
                                        >
                                            {isCopied ? (
                                                <>
                                                    <Check className="w-4 h-4 mr-2" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
                                    <span className="flex items-center">
                                        <Lock className="w-3 h-3 mr-1" />
                                        Protected & Monetized
                                    </span>
                                    <span>Create account to track earnings</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
