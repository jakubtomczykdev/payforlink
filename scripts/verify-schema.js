
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Verifying Prisma Client...");

    // 1. Check User model
    const user = await prisma.user.findFirst();
    if (user) {
        console.log(`User found. lifetimeEarnings: ${user.lifetimeEarnings} (Expect number, default 0)`);
        if (user.lifetimeEarnings === undefined) {
            console.error("FAIL: lifetimeEarnings is undefined on User model");
        } else {
            console.log("PASS: User model has lifetimeEarnings");
        }
    } else {
        console.log("No users found to verify user model.");
    }

    // 2. Check Reward model
    const rewards = await prisma.reward.findMany();
    console.log(`Found ${rewards.length} rewards.`);
    if (rewards.length > 0) {
        console.log("PASS: Reward model is accessible");
        console.log("Sample:", rewards[0].name);
    } else {
        console.error("FAIL: No rewards found (did seed run?)");
    }

    // 3. Check UserReward model
    // Just query it to see if it throws
    try {
        await prisma.userReward.count();
        console.log("PASS: UserReward model is accessible");
    } catch (e) {
        console.error("FAIL: UserReward model access error", e);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
