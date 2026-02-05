'use client';

import * as React from 'react';
import { CurrencyCode } from '@/src/types/currency';
import { CURRENCIES } from '@/lib/api';
import { Button } from './button';
import { ChevronDown } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from './popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from './command';

interface CurrencyDropdownProps {
    value: CurrencyCode;
    onChange: (currency: CurrencyCode) => void;
    excludeCurrency?: CurrencyCode;
}

export function CurrencyDropdown({
    value,
    onChange,
    excludeCurrency,
}: CurrencyDropdownProps) {
    const [open, setOpen] = React.useState(false);

    const currencies = Object.keys(CURRENCIES).filter(
        (code) => code !== excludeCurrency
    ) as CurrencyCode[];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    className="bg-[#252836] hover:bg-[#2D3748] rounded-full px-4 py-2 flex items-center gap-2 h-auto text-white border-none"
                >
                    <span className="font-bold text-sm tracking-tight">{value}</span>
                    <ChevronDown className="w-4 h-4 text-[#9CA3AF]" strokeWidth={3} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-0 bg-[#1B1D28] border-[#2D3748]" align="start">
                <Command className="bg-[#1B1D28]">
                    <CommandList className="bg-[#1B1D28]">
                        <CommandEmpty className="text-[#9CA3AF] py-6 text-center text-sm">
                            No currency found.
                        </CommandEmpty>
                        <CommandGroup>
                            {currencies.map((currency) => (
                                <CommandItem
                                    key={currency}
                                    value={currency}
                                    onSelect={() => {
                                        onChange(currency);
                                        setOpen(false);
                                    }}
                                    className="flex items-center justify-between cursor-pointer px-3 py-2 hover:bg-[#252836] text-[#E2E8F0]"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm">{currency}</span>
                                        <span className="text-[#9CA3AF] text-xs">
                                            {CURRENCIES[currency]?.name}
                                        </span>
                                    </div>
                                    {value === currency && (
                                        <div className="w-2 h-2 rounded-full bg-[#C7F284]" />
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
