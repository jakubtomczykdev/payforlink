import { auth, signOut } from "@/auth";
import { AlertTriangle, Mail } from "lucide-react";
import { redirect } from "next/navigation";

export default async function BannedPage() {
    const session = await auth();

    if (!session?.user?.isBanned) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-md w-full bg-zinc-900 border border-red-500/20 rounded-2xl p-8 shadow-2xl text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">Konto Zablokowane</h1>
                <p className="text-zinc-400 mb-6">
                    Twoje konto zostało zablokowane z powodu naruszenia naszego Regulaminu.
                </p>

                {session.user.banReason && (
                    <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4 mb-6 text-left">
                        <p className="text-xs text-red-400 font-bold uppercase tracking-wider mb-1">Powód blokady:</p>
                        <p className="text-sm text-zinc-300 font-mono">{session.user.banReason}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <a
                        href="mailto:support@payforlink.pl"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors font-medium border border-white/5"
                    >
                        <Mail className="w-4 h-4" />
                        Kontakt z Pomocą Techniczną
                    </a>

                    <form
                        action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/" });
                        }}
                    >
                        <button
                            type="submit"
                            className="text-sm text-zinc-500 hover:text-white transition-colors"
                        >
                            Wyloguj się z tego konta (Sign out)
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
