"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickShortenerProps {
    variant?: "default" | "sidebar";
}

export function QuickShortener({ variant = "default" }: QuickShortenerProps) {
    const [url, setUrl] = useState("");

    const isSidebar = variant === "sidebar";

    return (
        <div className={cn("w-full mx-auto md:mx-0", !isSidebar && "max-w-2xl")}>
            <div className={cn(
                "relative flex items-center bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-2 shadow-xl gap-2 w-full transition-all hover:bg-zinc-900/60 group",
                isSidebar ? "flex-col" : "flex-col md:flex-row"
            )}>
                <div className="relative flex-1 w-full">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Wklej link do skrócenia..."
                        className={cn(
                            "bg-transparent text-white placeholder-zinc-500 w-full focus:outline-none rounded-xl",
                            isSidebar ? "px-4 py-3 text-sm" : "px-4 md:px-6 py-3 md:py-4 text-base md:text-lg"
                        )}
                    />
                </div>
                <button
                    className={cn(
                        "flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap",
                        isSidebar ? "w-full py-2.5 text-xs" : "w-full md:w-auto px-6 py-3 md:py-4 text-sm"
                    )}
                >
                    <Zap className={cn("fill-black", isSidebar ? "w-4 h-4" : "w-5 h-5")} />
                    ZARABIAJ
                </button>
            </div>
        </div>
    );
}
