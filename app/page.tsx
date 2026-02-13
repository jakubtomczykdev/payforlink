import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { Features } from "@/components/landing/Features";
import { Comparison } from "@/components/landing/Comparison";
import { AnalyticsPreview } from "@/components/landing/AnalyticsPreview";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PayoutRates } from "@/components/landing/PayoutRates";
import { Calculator } from "@/components/landing/Calculator";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { StickyCTA } from "@/components/landing/StickyCTA";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Script from "next/script";

import { AbstractBackground } from "@/components/landing/AbstractBackground";

export default async function Home() {
    const session = await auth();

    if (session) {
        redirect("/dashboard");
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "SoftwareApplication",
                "name": "PayForLink",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "description": "Najskuteczniejszy skracacz linków z najwyższym CPM w Polsce. Zarabiaj na każdym kliknięciu.",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "PLN"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "ratingCount": "15420"
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Czy skracanie linków jest bezpieczne dla SEO?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Tak, nasze linki używają przekierowań 301/302, które są bezpieczne dla Twoich pozycji w Google."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Jakie są metody wypłat i czas oczekiwania?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Oferujemy wypłaty Instant (do 2h) na PayPal, Revolut, USDT (TRC20) oraz przelewy bankowe. Minimum: 20 PLN."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Czy akceptujecie ruch z social media?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Tak! Specjalizujemy się w monetyzacji ruchu z social media (Facebook, Telegram, TikTok)."
                        }
                    }
                ]
            }
        ]
    };

    return (
        <div className="min-h-screen text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
            <Script
                id="json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Global Dark Background */}
            <div className="fixed inset-0 bg-[#050505] -z-50" />

            {/* Spline 3D Background */}
            <AbstractBackground />

            {/* Global Ambience Layer - kept subtle for texture */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10">
                <Navbar />
                <main>
                    <Hero />
                    <TrustBar />
                    <Features />
                    <Comparison />
                    <AnalyticsPreview />
                    <HowItWorks />
                    <Testimonials />
                    <PayoutRates />
                    <Calculator />
                    <FAQ />
                    <CTA />
                </main>
                <Footer />
            </div>

            <StickyCTA />
        </div>
    );
}
