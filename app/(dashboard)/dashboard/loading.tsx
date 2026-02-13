import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] p-4 md:p-8 space-y-8 font-sans">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-12 w-full md:w-64" />
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-[140px] w-full rounded-xl border border-white/5" />
                ))}
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Chart & Links */}
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-[400px] w-full rounded-xl border border-white/5" />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-[120px] w-full rounded-xl border border-white/5" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="space-y-6 flex flex-col h-full">
                    <Skeleton className="h-[200px] w-full rounded-xl border border-white/5" />
                    <Skeleton className="flex-1 min-h-[300px] w-full rounded-xl border border-white/5" />
                    <Skeleton className="h-[250px] w-full rounded-xl border border-white/5" />
                </div>
            </div>
        </div>
    );
}
