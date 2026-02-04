'use client';

import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Button } from '@/components/ui/button';
import { ArrowDownUp } from 'lucide-react';

export function SwapWidget() {
    return (
        <div className="w-full max-w-[480px] bg-[#0D0E14] border border-[#2D3748]/50 rounded-[32px] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-1 bg-[#1B1D28] p-1 rounded-2xl">
                    <Button variant="ghost" className="h-9 px-4 rounded-xl text-[#C7F284] bg-[#252836] hover:bg-[#252836] hover:text-[#C7F284] text-xs font-bold font-sans">
                        Market
                    </Button>
                </div>
            </div>

            <div className="space-y-1 relative">
                <CurrencyInput
                    label="Sell"
                    currency="USD"
                    value="0.00"
                    usdValue="0"
                />

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <Button
                        size="icon-xs"
                        variant="ghost"
                        className="bg-[#252836] border-4 border-[#0D0E14] rounded-lg hover:bg-[#2D3748] transition-transform active:scale-95"
                    >
                        <ArrowDownUp className="w-3.5 h-3.5 text-[#67778E]" strokeWidth={3} />
                    </Button>
                </div>

                <CurrencyInput
                    label="Buy"
                    currency="MYR"
                    value="0.00"
                    usdValue="0"
                />
            </div>

            <Button className="w-full h-16 mt-4 bg-[#C7F284] hover:bg-[#C7F284]/80 text-[#0D0E14] rounded-2xl text-lg font-bold transition-all active:scale-[0.98] shadow-lg shadow-[#C7F284]/10 cursor-pointer">
                Swap
            </Button>
        </div>
    );
}
