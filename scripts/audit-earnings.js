const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Starting Earnings Audit...");

    const users = await prisma.user.findMany({
        include: {
            links: true,
        }
    });

    for (const user of users) {
        let calculatedUserEarnings = 0;
        let discrepancyFound = false;

        console.group(`User: ${user.email} (Wallet: ${user.walletBalance.toFixed(4)})`);

        for (const link of user.links) {
            // Fetch visits for this link
            // We need to replicate the monetized logic: isMonetized = true
            const monetizedVisits = await prisma.visit.count({
                where: {
                    linkId: link.id,
                    isMonetized: true
                }
            });

            const expectedLinkEarnings = monetizedVisits * 0.01;
            calculatedUserEarnings += expectedLinkEarnings;

            const diff = Math.abs(link.earnings - expectedLinkEarnings);
            if (diff > 0.009) { // Tolerance for float math
                console.log(`[MISMATCH] Link /${link.shortCode}: DB says ${link.earnings.toFixed(4)}, Visits say ${expectedLinkEarnings.toFixed(4)} (${monetizedVisits} visits)`);
                discrepancyFound = true;
            } else {
                // console.log(`[OK] Link /${link.shortCode}: ${link.earnings.toFixed(4)}`);
            }
        }

        // Check Wallet
        // Wallet should be Sum(Link Earnings) - Payouts + Adjustments
        // Since we don't have full ledger, we compare specific mismatch first.

        // Let's compare Wallet vs Calculated
        const walletDiff = Math.abs(user.walletBalance - calculatedUserEarnings);

        // We also need to subtract Payouts to see if that explains it
        const payouts = await prisma.payout.findMany({ where: { userId: user.id } });
        const totalPayouts = payouts.reduce((sum, p) => sum + p.amount, 0);

        const theoreticalBalance = calculatedUserEarnings - totalPayouts;
        const theoreticalDiff = Math.abs(user.walletBalance - theoreticalBalance);

        if (walletDiff > 0.01 && theoreticalDiff > 0.01) {
            console.log(`[WALLET MISMATCH] Expected (from Visits): ${calculatedUserEarnings.toFixed(4)} | Expected (after Payouts): ${theoreticalBalance.toFixed(4)} | Actual Wallet: ${user.walletBalance.toFixed(4)}`);
            console.log(`Payouts Total: ${totalPayouts}`);
            discrepancyFound = true;
        }

        if (!discrepancyFound) {
            console.log("All counts match.");
        }
        console.groupEnd();
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
