import { createLink } from "@/app/actions/create-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkIcon } from "lucide-react";

export default function CreateLinkPage() {
    return (
        <div className="max-w-2xl mx-auto mt-10">
            <Card className="bg-gray-950 border-gray-800 text-gray-200">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <LinkIcon className="text-emerald-500" />
                        Utwórz Nowy Link
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={async (formData) => {
                        "use server"
                        await createLink(formData)
                    }} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="url" className="text-sm font-medium text-gray-400">
                                Adres Docelowy URL
                            </label>
                            <input
                                type="url"
                                name="url"
                                required
                                placeholder="https://example.com/my-article"
                                className="w-full h-10 px-3 rounded-md bg-gray-900 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                            />
                        </div>

                        <div className="space-y-3 pt-2">
                            <label className="text-sm font-medium text-gray-400">
                                Tryb Zarabiania
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="cursor-pointer relative">
                                    <input type="radio" name="monetizationMode" value="STANDARD" className="peer sr-only" defaultChecked />
                                    <div className="p-4 rounded-lg bg-gray-900 border border-gray-800 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 transition-all hover:bg-gray-800">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-600 peer-checked:border-emerald-500 peer-checked:bg-emerald-500" />
                                            <span className="font-semibold text-white">Standard</span>
                                        </div>
                                        <p className="text-xs text-gray-400 pl-8">
                                            Klasyczny licznik, reklamy nieinwazyjne. Dla maksymalnego zasięgu.
                                        </p>
                                    </div>
                                </label>

                                <label className="cursor-pointer relative">
                                    <input type="radio" name="monetizationMode" value="PLUS" className="peer sr-only" />
                                    <div className="p-4 rounded-lg bg-gray-900 border border-gray-800 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 transition-all hover:bg-gray-800">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-600 peer-checked:border-emerald-500 peer-checked:bg-emerald-500" />
                                            <span className="font-semibold text-white">Zarabianie+</span>
                                        </div>
                                        <p className="text-xs text-gray-400 pl-8">
                                            Content Locker (CPA). Wymaga wykonania zadania. Najwyższe stawki.
                                        </p>
                                    </div>
                                </label>

                                <label className="cursor-pointer relative md:col-span-2">
                                    <input type="radio" name="monetizationMode" value="NSFW" className="peer sr-only" />
                                    <div className="p-4 rounded-lg bg-gray-900 border border-gray-800 peer-checked:border-red-500 peer-checked:bg-red-500/10 transition-all hover:bg-gray-800">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-600 peer-checked:border-red-500 peer-checked:bg-red-500" />
                                            <span className="font-semibold text-white">NSFW (18+)</span>
                                        </div>
                                        <p className="text-xs text-gray-400 pl-8">
                                            Oferty dla dorosłych. Wymagane potwierdzenie wieku. Content Locker.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
                            Skróć i Zarabiaj
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
