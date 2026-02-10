'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CurrencyDropdown } from '@/components/ui/CurrencyDropdown';
import { ArrowDownUp, Info, Loader2, CheckCircle2, X } from 'lucide-react';
import { useSwap } from '@/hooks/useSwap';
import { formatAmount } from '@/lib/swap';
import { isValidAmountFormat, ERROR_MESSAGES, SwapErrorCode } from '@/lib/validation';

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
    } = useSwap();

    // Captured swap details at click time (prevents race condition if user changes input)
    interface SwapDetails {
        inputValue: string;
        outputValue: string;
        inputCurrency: string;
        outputCurrency: string;
        fee: number | null;
    }
    const [swapDetails, setSwapDetails] = useState<SwapDetails | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Track validation errors
    const [inputWarning, setInputWarning] = useState<string | null>(null);
    const [outputWarning, setOutputWarning] = useState<string | null>(null);

    const hasAmount = (inputValue && parseFloat(inputValue) > 0) || (outputValue && parseFloat(outputValue) > 0);

    const showWarning = (setter: typeof setInputWarning) => {
        setter(ERROR_MESSAGES[SwapErrorCode.INVALID_FORMAT]);
        setTimeout(() => setter(null), 2000);
    };

    const handleSellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        // Block invalid format and show warning based on error code (for input)
        if (newValue && !isValidAmountFormat(newValue)) {
            showWarning(setInputWarning);
            return;
        }

        setInputWarning(null);
        handleInputType(newValue);
    };

    const handleBuyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        // Block invalid format and show warning based on error code (for output)
        if (newValue && !isValidAmountFormat(newValue)) {
            showWarning(setOutputWarning);
            return;
        }

        setOutputWarning(null);
        handleOutputType(newValue);
    };

    return (
        <div className="w-full max-w-[480px] bg-background border border-border/50 rounded-[32px] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-1 bg-card p-1 rounded-2xl">
                    <Button variant="ghost" className="h-9 px-4 rounded-xl text-primary bg-secondary hover:bg-secondary hover:text-primary text-xs font-bold font-sans">
                        Market
                    </Button>
                </div>
            </div>

            <div className="mb-4 flex items-center gap-2 text-muted-foreground text-xs">
                <Info className="w-3.5 h-3.5" />
                <span>1% fee applies to all swaps</span>
            </div>

            <div className="space-y-1 relative">
                <div className="bg-card rounded-2xl p-4 border border-transparent focus-within:border-border transition-colors">
                    <div className="text-muted-foreground text-xs font-medium mb-3">Sell</div>
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
                                className="bg-transparent border-none text-right text-4xl font-semibold text-foreground p-2 h-auto focus-visible:ring-0 placeholder:text-placeholder"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <Button
                        type="button"
                        onClick={handleSwapCurrencies}
                        aria-label="Swap input and output currencies"
                        className="bg-secondary border-4 border-background rounded-lg hover:bg-border transition-transform active:scale-95 cursor-pointer"
                    >
                        {loading ? (
                            <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                        ) : (
                            <ArrowDownUp className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={3} />
                        )}
                    </Button>
                </div>

                <div className="bg-card rounded-2xl p-4 border border-transparent focus-within:border-border transition-colors">
                    <div className="text-muted-foreground text-xs font-medium mb-3">Buy</div>
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
                                className={`bg-transparent border-none text-right text-4xl font-semibold p-2 h-auto focus-visible:ring-0 placeholder:text-placeholder ${loading ? 'text-muted-foreground' : 'text-foreground'}`}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Consolidated validation messages */}
            {(inputWarning || outputWarning) && (
                <div className="mt-3 px-1">
                    <p className="text-orange-400 text-xs">
                        {inputWarning || outputWarning}
                    </p>
                </div>
            )}

            {!hasAmount && (inputValue || outputValue) && !loading && !inputWarning && !outputWarning && (
                <div className="mt-3 px-1">
                    <p className="text-muted-foreground text-xs">
                        {ERROR_MESSAGES[SwapErrorCode.ZERO_OR_NEGATIVE]}
                    </p>
                </div>
            )}

            {hasAmount && fee !== null && !loading && (
                <div className="mt-4 p-4 bg-card rounded-xl border border-border/30 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">You Pay</span>
                        <span className="text-foreground font-medium">
                            {inputValue} {inputCurrency}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fee (1%)</span>
                        <span className="text-destructive font-medium">
                            - {formatAmount(fee, inputCurrency)} {inputCurrency}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount to Exchange</span>
                        <span className="text-foreground font-medium">
                            {formatAmount(parseFloat(inputValue.replace(/,/g, '')) - fee, inputCurrency)} {inputCurrency}
                        </span>
                    </div>
                    <div className="h-px bg-border/50" />
                    <div className="flex justify-between text-sm">
                        <span className="text-foreground font-semibold">You Receive</span>
                        <span className="text-primary font-bold">
                            {outputValue} {outputCurrency}
                        </span>
                    </div>
                </div>
            )}

            <Button
                type="button"
                onClick={async () => {
                    if (isSubmitting) return; // Prevent double-click 

                    setIsSubmitting(true);

                    // Capture values at click time (prevents race condition)
                    setSwapDetails({
                        inputValue,
                        outputValue,
                        inputCurrency,
                        outputCurrency,
                        fee
                    });

                    // Mock processing delay (simulates API call for swapping)
                    // If in prod, use idempotency key to prevent duplicate transactions
                    await new Promise(resolve => setTimeout(resolve, 500));

                    setIsSubmitting(false);
                    setShowSuccessModal(true);
                }}
                className="w-full mt-4 h-14 text-base font-bold rounded-2xl bg-primary text-primary-foreground hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                disabled={!hasAmount || loading || isSubmitting}
            >
                {isSubmitting ? 'Processing...' : loading ? 'Calculating...' : hasAmount ? 'Swap' : 'Enter an amount'}
            </Button>

            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-sm bg-background border border-border/50 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-card transition-colors"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>

                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-primary" />
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-foreground text-center mb-2">
                            Swap Successful!
                        </h2>
                        <p className="text-muted-foreground text-sm text-center mb-6">
                            Your transaction has been completed
                        </p>

                        {swapDetails && (
                            <div className="bg-card rounded-xl p-4 space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">You Paid</span>
                                    <span className="text-foreground font-medium">
                                        {swapDetails.inputValue} {swapDetails.inputCurrency}
                                    </span>
                                </div>
                                {swapDetails.fee !== null && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Fee (1%)</span>
                                        <span className="text-destructive font-medium">
                                            - {formatAmount(swapDetails.fee, swapDetails.inputCurrency as Parameters<typeof formatAmount>[1])} {swapDetails.inputCurrency}
                                        </span>
                                    </div>
                                )}
                                <div className="h-px bg-border/50" />
                                <div className="flex justify-between text-sm">
                                    <span className="text-foreground font-semibold">You Received</span>
                                    <span className="text-primary font-bold">
                                        {swapDetails.outputValue} {swapDetails.outputCurrency}
                                    </span>
                                </div>
                            </div>
                        )}

                        <Button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full h-12 text-base font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer"
                        >
                            Done
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
