"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        quote: "Przeszedłem z AdSense i moje zarobki wzrosły o 300%. Wypłaty tego samego dnia to game-changer dla mojego cashflow.",
        author: "Marek K.",
        role: "Twórca Contentu Gamingowego",
        niche: "Gaming",
        image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        quote: "Najlepsze stawki CPM dla ruchu z social media. Żadna inna sieć nie akceptuje ruchu z Telegrama z taką skutecznością.",
        author: "Karolina W.",
        role: "Właścicielka Kanału Telegram",
        niche: "Social Media",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        quote: "Transparentność to dla mnie klucz. Tutaj widzę każde kliknięcie i wiem, za co dostaję pieniądze. Polecam każdemu wydawcy.",
        author: "Piotr N.",
        role: "Administrator Forum Tech",
        niche: "Technology",
        image: "https://randomuser.me/api/portraits/men/86.jpg"
    }
];

export const Testimonials = () => {
    return (
        <section className="py-24 bg-[#0B0B0B] relative overflow-hidden" id="testimonials">
            <div className="absolute inset-0 bg-[#0B0B0B]" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Zaufali nam <br /> <span className="text-emerald-500">liderzy swoich nisz</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-zinc-900/30 border border-white/5 p-8 rounded-2xl backdrop-blur-sm relative"
                        >
                            <Quote className="absolute top-8 right-8 w-10 h-10 text-emerald-500/10" />

                            <p className="text-zinc-300 text-lg mb-8 leading-relaxed relative z-10">
                                "{t.quote}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-zinc-800">
                                    <Image
                                        src={t.image}
                                        alt={t.author}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">{t.author}</h4>
                                    <p className="text-xs text-emerald-400 font-medium uppercase tracking-wide">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
