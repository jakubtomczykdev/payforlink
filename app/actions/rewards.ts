'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function claimReward(formData: FormData) {
    const session = await auth();
    if (!session || !session.user?.email) {
        throw new Error("Unauthorized");
    }

    const rewardId = formData.get("rewardId") as string;
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const size = formData.get("size") as string | null;
    const phone = formData.get("phone") as string;

    if (!rewardId || !name || !address || !phone) {
        throw new Error("Missing required fields");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, lifetimeEarnings: true }
    });

    if (!user) throw new Error("User not found");

    const reward = await prisma.reward.findUnique({
        where: { id: rewardId }
    });

    if (!reward) throw new Error("Reward not found");

    if (user.lifetimeEarnings < reward.threshold) {
        throw new Error("You have not reached the threshold for this reward yet.");
    }

    // Check if already claimed
    const existingClaim = await prisma.userReward.findUnique({
        where: {
            userId_rewardId: {
                userId: user.id,
                rewardId: reward.id
            }
        }
    });

    if (existingClaim) {
        throw new Error("You have already claimed this reward.");
    }

    await prisma.userReward.create({
        data: {
            userId: user.id,
            rewardId: reward.id,
            status: "REQUESTED",
            shippingDetails: {
                name,
                address,
                phone,
                size: size || undefined
            }
        }
    });

    revalidatePath("/dashboard/rewards");
}

export async function markRewardShipped(formData: FormData) {
    // Admin only check should be here ideally, or protected by layout/middleware
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const claimId = formData.get("claimId") as string;

    await prisma.userReward.update({
        where: { id: claimId },
        data: {
            status: "SHIPPED",
            processedAt: new Date()
        }
    });

    revalidatePath("/admin/rewards");
}
