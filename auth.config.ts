import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
            const isOnOnboarding = nextUrl.pathname.startsWith('/onboarding')
            const isOnAuth = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register')

            // @ts-ignore
            const isOnboardingCompleted = auth?.user?.onboardingCompleted
            // @ts-ignore
            const isBanned = auth?.user?.isBanned

            const isOnBannedPage = nextUrl.pathname === '/banned'

            if (isBanned) {
                if (isOnBannedPage) return true;
                return Response.redirect(new URL('/banned', nextUrl));
            }

            if (isOnBannedPage && !isBanned) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }

            if (isOnDashboard) {
                if (isLoggedIn) {
                    if (!isOnboardingCompleted) {
                        return Response.redirect(new URL('/onboarding', nextUrl))
                    }
                    return true
                }
                return false // Redirect unauthenticated users to login page
            }

            if (isOnOnboarding) {
                if (!isLoggedIn) {
                    return Response.redirect(new URL('/login', nextUrl))
                }
                if (isOnboardingCompleted) {
                    return Response.redirect(new URL('/dashboard', nextUrl))
                }
                return true
            }

            if (isOnAuth) {
                if (isLoggedIn) {
                    return Response.redirect(new URL('/dashboard', nextUrl))
                }
                return true
            }

            return true
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                console.log("NextAuth: User signed in:", user.email);
                token.id = user.id as string;
                token.email = user.email as string;
                // @ts-ignore
                token.onboardingCompleted = user.onboardingCompleted;
                // @ts-ignore
                token.role = user.role;
                // @ts-ignore
                token.walletBalance = user.walletBalance;
                // @ts-ignore
                token.isBanned = user.isBanned;
                // @ts-ignore
                token.banReason = user.banReason;
            }
            if (trigger === "update" && session) {
                token = { ...token, ...session };
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                // @ts-ignore
                session.user.onboardingCompleted = token.onboardingCompleted as boolean;
                // @ts-ignore
                session.user.role = token.role as "USER" | "ADMIN";
                // @ts-ignore
                session.user.walletBalance = token.walletBalance as number;
                // @ts-ignore
                session.user.isBanned = token.isBanned as boolean;
                // @ts-ignore
                session.user.banReason = token.banReason as string | null;

                console.log("NextAuth: Active session for:", session.user.email);
            }
            return session;
        }
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
