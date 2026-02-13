export const DataRibbons = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
            className="absolute w-full h-full opacity-[0.05]"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
        >
            <path
                d="M0 50 Q 25 30, 50 50 T 100 50"
                fill="none"
                stroke="#10B981"
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
            />
            <path
                d="M0 60 Q 25 40, 50 60 T 100 60"
                fill="none"
                stroke="#10B981"
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
            />
            <path
                d="M0 40 Q 25 20, 50 40 T 100 40"
                fill="none"
                stroke="#10B981"
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    </div>
);
