'use client';

import * as React from 'react';
import { CurrencyCode } from '@/src/types/currency';
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

    // getting currency metadata
    const { CURRENCIES } = require('@/lib/api');

    const currencies = Object.keys(CURRENCIES).filter(
        (code) => code !== excludeCurrency
    ) as CurrencyCode[];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    className="bg-secondary hover:bg-border rounded-full px-4 py-2 flex items-center gap-2 h-auto text-white border-none"
                >
                    <span className="font-bold text-sm tracking-tight">{value}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" strokeWidth={3} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-0 bg-card border-border" align="start">
                <Command className="bg-card">
                    <CommandList className="bg-card">
                        <CommandEmpty className="text-muted-foreground py-6 text-center text-sm">
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
                                    className="flex items-center justify-between cursor-pointer px-3 py-2 hover:bg-secondary text-foreground"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm">{currency}</span>
                                        <span className="text-muted-foreground text-xs">
                                            {CURRENCIES[currency]?.name}
                                        </span>
                                    </div>
                                    {value === currency && (
                                        <div className="w-2 h-2 rounded-full bg-primary" />
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
