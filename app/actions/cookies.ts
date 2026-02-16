'use server';

import { cookies } from 'next/headers';

export async function setAdultVerifiedCookie() {
    const cookieStore = await cookies();

    // Set cookie for 30 days
    cookieStore.set('adult-verified', 'true', {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
}
