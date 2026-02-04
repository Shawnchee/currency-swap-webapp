'use client';

import { EXCHANGE_RATES } from '@/lib/exchange_rates';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

export function RatesTable() {
    const rates = Object.entries(EXCHANGE_RATES);

    return (
        <Card className="w-full max-w-[480px] bg-[#1B1D28] border-[#2D3748]/50 rounded-[20px] shadow-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-[#E2E8F0] text-sm font-bold tracking-wider text-center">
                    Current Exchange Rates (1 USD)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    {rates.map(([currency, rate]) => (
                        <div key={currency} className="flex justify-between items-center py-1 border-b border-[#2D3748]/30 last:border-0">
                            <span className="text-[#67778E] text-xs font-bold">{currency}</span>
                            <span className="text-[#E2E8F0] text-xs font-mono font-medium">
                                {rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
