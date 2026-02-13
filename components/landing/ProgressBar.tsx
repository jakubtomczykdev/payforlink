"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export const ProgressBar = () => {
    const { scrollYProgress } = useScroll();

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-50 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{ scaleX }}
        />
    );
};
