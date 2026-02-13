import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// Note: We cannot use standard Redis client in Edge Middleware unless using HTTP/REST
// Upstash Redis SDK (via REST) IS compatible with Edge Runtime!
import { Redis } from '@upstash/redis'

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    // 1. Dashboard Protection
    const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

    if (isOnDashboard) {
        if (isLoggedIn) return NextResponse.next();
        return NextResponse.redirect(new URL('/login', nextUrl));
    }

    // 2. Fast Link Check (Optional Optimization)
    // If it's a short code (not api, not static, not dashboard)
    const isAsset = nextUrl.pathname.includes('.') || nextUrl.pathname.startsWith('/api') || nextUrl.pathname.startsWith('/_next');
    if (!isAsset && nextUrl.pathname.length > 1) {
        // Optional Redis check here
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
