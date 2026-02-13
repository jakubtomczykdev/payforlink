
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Starting backfill for lifetimeEarnings...");

    const users = await prisma.user.findMany({
        include: {
            payouts: true,
        },
    });

    console.log(`Found ${users.length} users to process.`);

    for (const user of users) {
        // 1. Calculate total payouts
        const totalPayouts = user.payouts.reduce((acc, payout) => acc + payout.amount, 0);

        // 2. Calculate correct lifetime earnings
        // Assumption: walletBalance is current (unpaid) earnings.
        // lifetime should be what they have now + what they took out.
        // Note: If walletBalance was manipulated manually without going through 'processClick', this might be slightly off, but it's the best reconstruction we have.
        const calculatedLifetime = user.walletBalance + totalPayouts;

        if (calculatedLifetime > user.lifetimeEarnings) {
            console.log(`User ${user.email}: Updating lifetimeEarnings from ${user.lifetimeEarnings} to ${calculatedLifetime.toFixed(2)} (Wallet: ${user.walletBalance} + Payouts: ${totalPayouts})`);

            await prisma.user.update({
                where: { id: user.id },
                data: { lifetimeEarnings: calculatedLifetime },
            });
        } else {
            console.log(`User ${user.email}: Skipped (Calculated ${calculatedLifetime} <= Current ${user.lifetimeEarnings})`);
        }
    }

    console.log("Backfill completed.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
