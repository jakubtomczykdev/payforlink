'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateBusinessProfile(data: {
    referralSource: string,
    predictedTraffic: string,
    socialMediaLinks: string
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            referralSource: data.referralSource,
            predictedTraffic: data.predictedTraffic,
            socialMediaLinks: data.socialMediaLinks,
        }
    })

    return { success: true }
}

export async function updatePayoutDetails(data: {
    preferredPayoutMethod: "BANK" | "USDT",
    bankAccount?: string,
    usdtAddress?: string
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            preferredPayoutMethod: data.preferredPayoutMethod,
            bankAccount: data.bankAccount,
            usdtAddress: data.usdtAddress,
        }
    })

    return { success: true }
}

export async function completeOnboarding() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.user.update({
        where: { id: session.user.id },
        data: { onboardingCompleted: true }
    })

    // Force session update usually requires a re-login or client-side strategy,
    // but the next request will see the DB change if we query it, 
    // however checking session token might be stale.
    // We rely on the DB update and standard redirect which should eventually propagate.
    // For immediate effect we might need to handle token refresh or just trust the DB check if we moved checking to DB (but middleware uses token).
    // Note: The middleware logic relies on the session token.
    // The session token is JWT. It won't update until it's refreshed.
    // We might need to trigger a session update on the client side after this action returns.

    return { success: true }
}
