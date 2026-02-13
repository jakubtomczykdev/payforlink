"use client";

export const AbstractBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
            {/* Dark Base */}
            <div className="absolute inset-0 bg-[#050505]" />

            {/* Subtle Grain Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

            {/* Gradient Blobs */}
            <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-emerald-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] -right-[10%] w-[70vw] h-[70vw] bg-purple-500/5 rounded-full blur-[120px]" />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"
                style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}
            />
        </div>
    );
};
