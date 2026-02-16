const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Find the first valid user and link
    const user = await prisma.user.findFirst();
    const link = await prisma.link.findFirst({
        where: { userId: user.id }
    });

    if (!user || !link) {
        console.log("No user or link found to generate test URL.");
        return;
    }

    const payout = "2.50";
    const currency = "PLN";
    const status = "MANUAL_TEST";
    const visitToken = "test-token-" + Date.now();

    // Construct URL
    // Matches: userId={sub1}&shortCode={sub2}&visitToken={sub3}&payout={lead}&currency={currency}&status={status}
    const url = `https://payforlink.onrender.com/api/postback?userId=${user.id}&shortCode=${link.shortCode}&visitToken=${visitToken}&payout=${payout}&currency=${currency}&status=${status}`;

    console.log("\n=== TEST POSTBACK URL ===");
    console.log(`User Email: ${user.email}`);
    console.log(`Link:       /${link.shortCode}`);
    console.log(`Amount:     ${payout} ${currency}`);
    console.log("\nClick this link to add money to the user above:");
    console.log(url);
    console.log("\n=========================");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
