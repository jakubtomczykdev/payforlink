import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    gradient?: boolean;
}

export function GlassCard({ children, className, gradient = false, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#09090B]/60 backdrop-blur-2xl transition-all duration-300 shadow-xl",
                gradient && "bg-gradient-to-br from-emerald-500/[0.08] to-transparent border-emerald-500/10",
                "hover:border-white/[0.15] hover:bg-[#09090B]/80",
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
