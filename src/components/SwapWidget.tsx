'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CurrencyDropdown } from '@/components/ui/CurrencyDropdown';
import { ArrowDownUp, Info, Loader2 } from 'lucide-react';
import { useSwap } from '@/hooks/useSwap';
import { formatAmount, isValidAmount } from '@/lib/swap';

export function SwapWidget() {
    const {
        inputCurrency,
        outputCurrency,
        inputValue,
        outputValue,
        loading,
        fee,
        setInputCurrency,
        setOutputCurrency,
        handleInputType,
        handleOutputType,
        handleSwapCurrencies,
        executeSwap,
    } = useSwap();

    const hasAmount = (inputValue && parseFloat(inputValue) > 0) || (outputValue && parseFloat(outputValue) > 0);

    const handleSellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (isValidAmount(newValue)) {
            handleInputType(newValue);
        }
    };

    const handleBuyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (isValidAmount(newValue)) {
            handleOutputType(newValue);
        }
    };

    return (
        <div className="w-full max-w-[480px] bg-[#0D0E14] border border-[#2D3748]/50 rounded-[32px] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-1 bg-[#1B1D28] p-1 rounded-2xl">
                    <Button variant="ghost" className="h-9 px-4 rounded-xl text-[#C7F284] bg-[#252836] hover:bg-[#252836] hover:text-[#C7F284] text-xs font-bold font-sans">
                        Market
                    </Button>
                </div>
            </div>

            <div className="mb-4 flex items-center gap-2 text-[#67778E] text-xs">
                <Info className="w-3.5 h-3.5" />
                <span>1% fee applies to all swaps</span>
            </div>

            <div className="space-y-1 relative">
                <div className="bg-[#1B1D28] rounded-2xl p-4 border border-transparent focus-within:border-[#2D3748] transition-colors">
                    <div className="text-[#67778E] text-xs font-medium mb-3">Sell</div>
                    <div className="flex items-center justify-between gap-4">
                        <CurrencyDropdown
                            value={inputCurrency}
                            onChange={setInputCurrency}
                            excludeCurrency={outputCurrency}
                        />
                        <div className="flex-1 flex flex-col items-end overflow-hidden">
                            <Input
                                type="text"
                                inputMode="decimal"
                                value={inputValue}
                                onChange={handleSellChange}
                                className="bg-transparent border-none text-right text-4xl font-semibold text-[#E2E8F0] p-2 h-auto focus-visible:ring-0 placeholder:text-[#4A5568]"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <Button
                        type="button"
                        onClick={handleSwapCurrencies}
                        className="bg-[#252836] border-4 border-[#0D0E14] rounded-lg hover:bg-[#2D3748] transition-transform active:scale-95"
                    >
                        {loading ? (
                            <Loader2 className="w-3.5 h-3.5 text-[#C7F284] animate-spin" />
                        ) : (
                            <ArrowDownUp className="w-3.5 h-3.5 text-[#67778E]" strokeWidth={3} />
                        )}
                    </Button>
                </div>

                <div className="bg-[#1B1D28] rounded-2xl p-4 border border-transparent focus-within:border-[#2D3748] transition-colors">
                    <div className="text-[#67778E] text-xs font-medium mb-3">Buy</div>
                    <div className="flex items-center justify-between gap-4">
                        <CurrencyDropdown
                            value={outputCurrency}
                            onChange={setOutputCurrency}
                            excludeCurrency={inputCurrency}
                        />
                        <div className="flex-1 flex flex-col items-end overflow-hidden">
                            <Input
                                type="text"
                                inputMode="decimal"
                                value={outputValue}
                                onChange={handleBuyChange}
                                className={`bg-transparent border-none text-right text-4xl font-semibold p-2 h-auto focus-visible:ring-0 placeholder:text-[#4A5568] ${loading ? 'text-[#67778E]' : 'text-[#E2E8F0]'}`}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {hasAmount && fee !== null && !loading && (
                <div className="mt-4 p-4 bg-[#1B1D28] rounded-xl border border-[#2D3748]/30 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-[#67778E]">You Pay</span>
                        <span className="text-[#E2E8F0] font-medium">
                            {inputValue} {inputCurrency}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-[#67778E]">Fee (1%)</span>
                        <span className="text-[#EF4444] font-medium">
                            - {formatAmount(fee, inputCurrency)} {inputCurrency}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-[#67778E]">Amount to Exchange</span>
                        <span className="text-[#E2E8F0] font-medium">
                            {formatAmount(parseFloat(inputValue.replace(/,/g, '')) - fee, inputCurrency)} {inputCurrency}
                        </span>
                    </div>
                    <div className="h-px bg-[#2D3748]/50" />
                    <div className="flex justify-between text-sm">
                        <span className="text-[#E2E8F0] font-semibold">You Receive</span>
                        <span className="text-[#C7F284] font-bold">
                            {outputValue} {outputCurrency}
                        </span>
                    </div>
                </div>
            )}

            <Button
                type="button"
                onClick={executeSwap}
                className="w-full mt-4 h-14 text-base font-bold rounded-2xl bg-[#C7F284] text-[#0D0E14] hover:bg-[#b0d96d] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!hasAmount || loading}
            >
                {loading ? 'Calculating...' : hasAmount ? 'Swap' : 'Enter an amount'}
            </Button>
        </div>
    );
}
