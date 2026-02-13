import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white space-y-4">
            <h2 className="text-4xl font-bold text-emerald-500">404 - Nie Znaleziono</h2>
            <p className="text-gray-400">Nie można znaleźć żądanego zasobu</p>
            <Button asChild className="bg-emerald-500 text-black hover:bg-emerald-600">
                <Link href="/">Powrót do Strony Głównej</Link>
            </Button>
        </div>
    )
}
