import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    gradient?: boolean;
}

export function GlassCard({ children, className, gradient = false, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                // Matching BentoCard style from Dashboard
                "relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/80 backdrop-blur-xl transition-all duration-300 shadow-2xl",
                gradient && "bg-gradient-to-br from-emerald-500/[0.05] to-zinc-900/80 border-emerald-500/10",
                "hover:bg-zinc-900/90 hover:border-white/10",
                className
            )}
            {...props}
        >
            {gradient && (
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />
            )}
            {/* Subtle noise texture or shine could go here */}
            {children}
        </div>
    );
}
