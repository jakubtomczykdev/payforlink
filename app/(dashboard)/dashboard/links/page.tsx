import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import LinkTable from "../LinkTable";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LinksPage() {
    const session = await auth();
    if (!session || !session.user?.email) redirect("/api/auth/signin");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            links: { orderBy: { createdAt: 'desc' } }
        }
    });

    if (!user) return <div>User not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-emerald-500">Moje Linki</h2>
                <Link href="/dashboard/create" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    + Utwórz Nowy
                </Link>
            </div>
            <div className="border border-gray-800 rounded-xl bg-gray-950/50 overflow-hidden">
                <LinkTable links={user.links} />
            </div>
        </div>
    );
}
