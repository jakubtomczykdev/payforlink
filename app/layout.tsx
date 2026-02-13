import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "PayForLink - Link-to-Earn URL Shortener",
    description: "Monetize your links with PayForLink.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased dark bg-[#0A0A0A] text-zinc-100`}>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
