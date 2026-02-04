'use client';

import { CurrencyCode } from '@/types';
import { Input } from './input';
import { Button } from './button';
import { ChevronDown } from 'lucide-react';

interface CurrencyInputProps {
    label: string;
    value: string;
    currency: CurrencyCode;
    usdValue: string;
}

export function CurrencyInput({
    label,
    value,
    currency,
}: CurrencyInputProps) {
    return (
        <div className="bg-[#1B1D28] rounded-2xl p-4 border border-transparent focus-within:border-[#2D3748] transition-colors">
            <div className="text-[#67778E] text-xs font-medium mb-3">{label}</div>

            <div className="flex items-center justify-between gap-4">
                <Button
                    variant="ghost"
                    className="bg-[#252836] hover:bg-[#2D3748] rounded-full px-4 py-2 flex items-center gap-2 h-auto text-white border-none"
                >
                    <span className="font-bold text-sm tracking-tight">{currency}</span>
                    <ChevronDown className="w-4 h-4 text-[#67778E]" strokeWidth={3} />
                </Button>

                <div className="flex-1 flex flex-col items-end overflow-hidden">
                    <Input
                        type="text"
                        value={value}
                        readOnly
                        className="bg-transparent border-none text-right text-4xl font-semibold text-[#E2E8F0] p-2 h-auto focus-visible:ring-0 placeholder:text-[#4A5568]"
                        placeholder="0.00"
                    />
                </div>
            </div>
        </div>
    );
}
