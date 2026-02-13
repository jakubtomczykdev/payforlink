"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TextRevealProps {
    children: React.ReactNode;
    className?: string;
    as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
    delay?: number;
}

export const TextReveal = ({ children, className, as: Component = "h2", delay = 0 }: TextRevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    return (
        <Component ref={ref} className={cn("relative overflow-hidden inline-block py-1", className)}>
            <span className="invisible">{children}</span>
            <motion.span
                initial={{ clipPath: "inset(0 50% 0 50%)", y: 20, opacity: 0 }}
                animate={isInView ? { clipPath: "inset(0 0% 0 0%)", y: 0, opacity: 1 } : { clipPath: "inset(0 50% 0 50%)", y: 20, opacity: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }} // Custom ease
                className="absolute inset-0 flex items-center justify-center bg-clip-text"
            >
                {children}
            </motion.span>
        </Component>
    );
};
