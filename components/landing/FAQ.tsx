import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "Czy skracanie linków jest bezpieczne dla SEO?",
        answer: "Tak, nasze linki używają przekierowań 301/302, które są bezpieczne dla Twoich pozycji w Google. Dodatkowo, nasze domeny posiadają wysoki Trust Flow."
    },
    {
        question: "Jakie są metody wypłat i czas oczekiwania?",
        answer: "Oferujemy wypłaty Instant (do 2h) na PayPal, Revolut, USDT (TRC20) oraz tradycyjne przelewy bankowe. Minimum do wypłaty to tylko 20 PLN."
    },
    {
        question: "Czy akceptujecie ruch z social media (Facebook, Telegram)?",
        answer: "Tak! Specjalizujemy się w monetyzacji ruchu z social media. Nasze linki nie są blokowane przez Facebooka czy Instagrama dzięki technologii rotacji domen."
    },
    {
        question: "Czy mogę używać PayForLink na stronach dla dorosłych?",
        answer: "Posiadamy oddzielną kategorię reklam dla treści Adult. Przy tworzeniu konta zaznacz odpowiednią opcję, aby otrzymywać reklamy dopasowane do Twojej niszy."
    }
];

export const FAQ = () => {
    return (
        <section className="py-24 bg-[#0B0B0B] relative" id="faq">
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Często zadawane <span className="text-emerald-500">pytania</span>
                    </h2>
                    <p className="text-zinc-400 text-lg">
                        Wszystko, co musisz wiedzieć, zanim zaczniesz.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border border-white/5 bg-zinc-900/20 rounded-xl px-4">
                            <AccordionTrigger className="text-lg text-white font-medium hover:text-emerald-400 no-underline hover:no-underline py-6">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-zinc-400 leading-relaxed pb-6 text-base">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};
