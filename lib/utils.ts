import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Basic proxy detection - refined for Render/Cloud environments
export function detectProxy(headings: Record<string, string>): boolean {
    // We removed check for 'x-forwarded-for' commas and 'via' because Render/Cloudflare always add them.
    // In a real production app, you'd use a dedicated IP reputation service (e.g. keydb, ipqualityscore).
    return (
        !!headings['x-proxy-id'] ||
        !!headings['x-vpn'] ||
        !!headings['tor-control'] ||
        headings['user-agent']?.includes('curl') ||
        headings['user-agent']?.includes('python')
    );
}
