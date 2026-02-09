'use client';

import { EXCHANGE_RATES } from '@/lib/exchange_rates';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

export function RatesTable() {
    const rates = Object.entries(EXCHANGE_RATES);

    return (
        <Card className="w-full max-w-[480px] bg-card border-border/50 rounded-[20px] shadow-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-sm font-bold tracking-wider text-center">
                    Current Exchange Rates (1 USD)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    {rates.map(([currency, rate]) => (
                        <div key={currency} className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
                            <span className="text-muted-foreground text-xs font-bold">{currency}</span>
                            <span className="text-foreground text-xs font-mono font-medium">
                                {rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
