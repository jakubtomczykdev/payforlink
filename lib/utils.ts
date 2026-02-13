import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function detectProxy(headings: Record<string, string>): boolean {
    return (
        !!headings['x-forwarded-for']?.includes(',') || // Multiple hops often means proxy
        !!headings['via'] ||
        !!headings['x-proxy-id'] ||
        !!headings['x-vpn'] ||
        !!headings['tor-control']
    );
}
