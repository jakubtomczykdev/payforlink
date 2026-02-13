import { ProfitCalculator } from "./ProfitCalculator";

export default function CalculatorPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-tight">Kalkulator Zysków</h1>
            <p className="text-gray-400 max-w-2xl">
                Symulacja rentowności biznesowej. Oblicz potencjalny zysk netto uwzględniając ruch, konwersję sieci afiliacyjnej oraz koszty wypłat dla użytkowników.
            </p>

            <ProfitCalculator />
        </div>
    );
}
