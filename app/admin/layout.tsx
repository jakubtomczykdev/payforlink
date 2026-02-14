// ... imports
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth();

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    // Double check role in DB to be safe
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
        redirect("/dashboard"); // Kick non-admins back to user dashboard
    }

    return (
        <AdminLayoutShell>
            {children}
        </AdminLayoutShell>
    );
}
