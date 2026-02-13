"use client";

import { motion, useInView, Variant } from "framer-motion";
import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    width?: "fit-content" | "100%";
    mode?: "fade" | "slide-up" | "slide-right" | "slide-left" | "zoom" | "blur-slide";
    staggerDelay?: number;
    delay?: number;
    once?: boolean;
    margin?: string;
    amount?: number | "some" | "all";
}

export const ScrollReveal = ({
    children,
    className,
    width = "fit-content",
    mode = "blur-slide",
    staggerDelay = 0.1,
    delay = 0,
    once = false,
    margin = "-20%", // Trigger slightly before the element is fully in view
    amount = 0.3
}: ScrollRevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, amount, margin: margin as any });

    const variants: Record<string, { hidden: Variant; visible: Variant }> = {
        fade: {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
        },
        "slide-up": {
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
        },
        "slide-right": {
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
        },
        "slide-left": {
            hidden: { opacity: 0, x: 50 },
            visible: { opacity: 1, x: 0 },
        },
        zoom: {
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
        },
        "blur-slide": {
            hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        },
    };

    const selectedVariant = variants[mode];

    return (
        <motion.div
            ref={ref}
            variants={{
                hidden: {
                    ...selectedVariant.hidden,
                    transition: { staggerChildren: staggerDelay }
                },
                visible: {
                    ...selectedVariant.visible,
                    transition: {
                        duration: 0.8,
                        ease: [0.25, 0.4, 0.25, 1], // Apple-like ease
                        delay: delay,
                        staggerChildren: staggerDelay,
                        type: "spring",
                        stiffness: 50,
                        damping: 20
                    }
                },
            }}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={cn(className, width === "100%" ? "w-full" : "")}
        >
            {children}
        </motion.div>
    );
};
