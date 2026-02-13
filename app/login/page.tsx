'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Chrome, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        // Added redirect: true and ensuring account selection is forced
        await signIn('google', {
            callbackUrl: '/dashboard',
            redirect: true
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[128px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10 px-4"
            >
                <Card className="bg-gray-950/50 border-gray-800 backdrop-blur-xl shadow-2xl overflow-hidden">
                    <CardHeader className="text-center space-y-4 pb-2">
                        <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center ring-1 ring-emerald-500/20">
                            <Coins className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight text-white">Witaj Ponownie</CardTitle>
                            <CardDescription className="text-gray-400 mt-2">
                                Zaloguj się, aby zarządzać swoim ekosystemem
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <Button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full h-12 bg-white text-black hover:bg-gray-200 font-bold text-base transition-all relative group overflow-hidden"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <Chrome className="w-5 h-5 mr-3" />
                            {loading ? 'Łączenie...' : 'Kontynuuj z Google'}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-gray-950 px-2 text-gray-500">Bezpieczny Dostęp</span>
                            </div>
                        </div>

                        <div className="text-center text-xs text-gray-600">
                            Klikając kontynuuj, zgadzasz się z naszym <span className="underline cursor-pointer hover:text-gray-400">Regulaminem</span> i <span className="underline cursor-pointer hover:text-gray-400">Polityką Prywatności</span>.
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
