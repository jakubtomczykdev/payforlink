import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BentoCardProps {
    title?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
    noPadding?: boolean;
}

export function BentoCard({ title, action, children, className, noPadding = false }: BentoCardProps) {
    return (
        <div className={cn(
            "bg-zinc-900/80 rounded-2xl border border-white/5 flex flex-col shadow-xl will-change-transform",
            !noPadding && "p-3 md:p-6",
            className
        )}>
            {(title || action) && (
                <div className="flex-none flex items-center justify-between mb-4">
                    {title && <h3 className="text-zinc-100 font-semibold text-sm tracking-tight">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className={cn("flex-1 min-h-0 w-full", (noPadding || className?.includes('h-')) && "h-full flex flex-col")}>
                {children}
            </div>
        </div>
    );
}
