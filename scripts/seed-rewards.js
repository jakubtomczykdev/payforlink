
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const rewards = [
        {
            slug: 'tshirt-200',
            name: 'Official T-Shirt',
            threshold: 200.0,
            description: 'High quality cotton t-shirt with PayForLink logo.',
            isActive: true,
        },
        {
            slug: 'hoodie-500',
            name: 'Premium Hoodie',
            threshold: 500.0,
            description: 'Warm and comfortable hoodie for top earners.',
            isActive: true,
        },
        {
            slug: 'trophy-10000',
            name: 'Earner Trophy',
            threshold: 10000.0,
            description: 'Glass trophy to showcase your success.',
            isActive: true,
        },
    ];

    for (const reward of rewards) {
        await prisma.reward.upsert({
            where: { slug: reward.slug },
            update: reward,
            create: reward,
        });
        console.log(`Upserted reward: ${reward.name}`);
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
