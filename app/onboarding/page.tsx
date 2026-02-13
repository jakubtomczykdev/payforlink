'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Check, Wallet, Building2, Globe, Users, Target } from 'lucide-react'
import { updateBusinessProfile, updatePayoutDetails, completeOnboarding } from './actions'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function OnboardingPage() {
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { update } = useSession()

    const [formData, setFormData] = useState({
        referralSource: "",
        predictedTraffic: "",
        socialMediaLinks: "",
        preferredPayoutMethod: "USDT" as "USDT" | "BANK",
        bankAccount: "",
        usdtAddress: ""
    })

    const handleNext = async () => {
        setIsLoading(true)
        try {
            if (step === 2) {
                await updateBusinessProfile({
                    referralSource: formData.referralSource,
                    predictedTraffic: formData.predictedTraffic,
                    socialMediaLinks: formData.socialMediaLinks,
                })
            }
            if (step === 3) {
                await updatePayoutDetails({
                    preferredPayoutMethod: formData.preferredPayoutMethod,
                    bankAccount: formData.bankAccount,
                    usdtAddress: formData.usdtAddress,
                })
            }

            if (step < 4) {
                setStep(step + 1)
            } else {
                await completeOnboarding()
                await update({ onboardingCompleted: true }) // Force session update with data
                router.push('/dashboard')
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const steps = [
        { id: 1, title: "Witaj" },
        { id: 2, title: "Zasięg" },
        { id: 3, title: "Wypłaty" },
        { id: 4, title: "Gotowe" }
    ]

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointing-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-900/20 rounded-full blur-[128px]" />
            </div>

            <div className="w-full max-w-2xl z-10 relative">
                {/* Progress Bar */}
                <div className="flex justify-between mb-8 px-2">
                    {steps.map((s) => (
                        <div key={s.id} className="flex flex-col items-center flex-1">
                            <div className={`w-full h-1 rounded-full mb-2 transition-all duration-500 ${step >= s.id ? 'bg-emerald-500' : 'bg-gray-800'}`} />
                            <span className={`text-xs uppercase tracking-wider font-medium ${step >= s.id ? 'text-emerald-400' : 'text-gray-600'}`}>{s.title}</span>
                        </div>
                    ))}
                </div>

                <Card className="bg-gray-950/50 border-gray-800 backdrop-blur-xl shadow-2xl overflow-hidden h-[500px] flex flex-col relative">
                    <CardContent className="p-8 flex-1 flex flex-col">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex flex-col items-center justify-center h-full text-center space-y-6"
                                >
                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-emerald-500/20">
                                        <Wallet className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <h1 className="text-4xl font-bold tracking-tight">Witaj w Payforlink</h1>
                                    <p className="text-gray-400 text-lg max-w-md">
                                        Platforma monetyzacji premium dla Twojego ruchu. Skonfigurujmy Twoje konto, abyś mógł zacząć zarabiać w kilka minut.
                                    </p>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex flex-col h-full"
                                >
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                        <Target className="w-6 h-6 text-emerald-500" />
                                        Twój Zasięg
                                    </h2>
                                    <div className="space-y-6 flex-1">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Jak nas znalazłeś?</label>
                                            <Select onValueChange={(v) => setFormData({ ...formData, referralSource: v })}>
                                                <SelectTrigger className="bg-gray-900 border-gray-700">
                                                    <SelectValue placeholder="Wybierz źródło" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="google">Wyszukiwarka Google</SelectItem>
                                                    <SelectItem value="social">Media Społecznościowe</SelectItem>
                                                    <SelectItem value="friend">Znajomy / Polecenie</SelectItem>
                                                    <SelectItem value="forum">Forum (BlackHatWorld, itp.)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Szacowany Miesięczny Ruch</label>
                                            <Select onValueChange={(v) => setFormData({ ...formData, predictedTraffic: v })}>
                                                <SelectTrigger className="bg-gray-900 border-gray-700">
                                                    <SelectValue placeholder="Wybierz wielkość" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0-1k">0 - 1,000 wizyt</SelectItem>
                                                    <SelectItem value="1k-10k">1,000 - 10,000 wizyt</SelectItem>
                                                    <SelectItem value="10k-100k">10,000 - 100,000 wizyt</SelectItem>
                                                    <SelectItem value="100k+">100,000+ wizyt</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Linki do Mediów Społecznościowych</label>
                                            <Input
                                                placeholder="np. twitter.com/username, telegram..."
                                                className="bg-gray-900 border-gray-700"
                                                value={formData.socialMediaLinks}
                                                onChange={(e) => setFormData({ ...formData, socialMediaLinks: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex flex-col h-full"
                                >
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                        <Wallet className="w-6 h-6 text-emerald-500" />
                                        Konfiguracja Wypłat
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div
                                            onClick={() => setFormData({ ...formData, preferredPayoutMethod: 'USDT' })}
                                            className={`cursor-pointer p-4 rounded-xl border transition-all ${formData.preferredPayoutMethod === 'USDT' ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500' : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'}`}
                                        >
                                            <Globe className="w-8 h-8 mb-2 text-emerald-500" />
                                            <div className="font-bold">Kryptowaluty (USDT)</div>
                                            <div className="text-xs text-gray-400">Szybko i Anonimowo</div>
                                        </div>
                                        <div
                                            onClick={() => setFormData({ ...formData, preferredPayoutMethod: 'BANK' })}
                                            className={`cursor-pointer p-4 rounded-xl border transition-all ${formData.preferredPayoutMethod === 'BANK' ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500' : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'}`}
                                        >
                                            <Building2 className="w-8 h-8 mb-2 text-blue-400" />
                                            <div className="font-bold">Przelew Bankowy</div>
                                            <div className="text-xs text-gray-400">Tradycyjnie i Bezpiecznie</div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {formData.preferredPayoutMethod === 'USDT' && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Adres Portfela TRC20</label>
                                                <Input
                                                    placeholder="T..."
                                                    className="bg-gray-900 border-gray-700 font-mono"
                                                    value={formData.usdtAddress}
                                                    onChange={(e) => setFormData({ ...formData, usdtAddress: e.target.value })}
                                                />
                                            </div>
                                        )}
                                        {formData.preferredPayoutMethod === 'BANK' && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Numer IBAN</label>
                                                <Input
                                                    placeholder="PL..."
                                                    className="bg-gray-900 border-gray-700 font-mono"
                                                    value={formData.bankAccount}
                                                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center h-full text-center space-y-6"
                                >
                                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                                        <Check className="w-12 h-12 text-black" />
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight">Wszystko Gotowe!</h1>
                                    <p className="text-gray-400 text-lg max-w-md">
                                        Twoje konto jest gotowe. Zacznij tworzyć linki i kierować ruch, aby zobaczyć wymierne wyniki.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Buttons - Absolute bottom or flex end */}
                        <div className="mt-auto pt-8 flex justify-end">
                            <Button
                                onClick={handleNext}
                                disabled={isLoading}
                                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8"
                            >
                                {isLoading ? "Przetwarzanie..." : step === 4 ? "Przejdź do Panelu" : "Kontynuuj"}
                                {!isLoading && step < 4 && <ArrowRight className="w-4 h-4 ml-2" />}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
