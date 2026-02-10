'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CurrencyCode } from '@/src/types/currency';
import { calculateSwapOutput, calculateSwapInput, formatAmount, parseAmount } from '@/lib/swap';
import { validateAmount, isValidCurrencyCode } from '@/lib/validation';

export function useSwap() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isInitializedRef = useRef(false);

    // Initialize state from URL or defaults
    const getInitialCurrency = (param: string, fallback: CurrencyCode): CurrencyCode => {
        const value = searchParams.get(param);
        return isValidCurrencyCode(value) ? value : fallback;
    };

    const [inputCurrency, setInputCurrency] = useState<CurrencyCode>(() =>
        getInitialCurrency('from', 'USD')
    );
    const [outputCurrency, setOutputCurrency] = useState<CurrencyCode>(() =>
        getInitialCurrency('to', 'MYR')
    );
    const [typedValue, setTypedValue] = useState<string>(() =>
        searchParams.get('amount') || ''
    );
    const [activeField, setActiveField] = useState<'input' | 'output'>(() => {
        const field = searchParams.get('field');
        return field === 'output' ? 'output' : 'input';
    });

    // Fake loading UI state — brief visual indicator
    const [isAnimating, setIsAnimating] = useState(false);

    const triggerLoadingAnimation = () => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
    };

    // Derive swap result directly from state
    const swapResult = useMemo(() => {
        if (!typedValue || typedValue.trim() === '') {
            return { inputValue: '', outputValue: '', error: null, fee: null, rate: null };
        }

        // Validate the amount first
        const validation = validateAmount(typedValue);
        if (!validation.valid) {
            return {
                inputValue: activeField === 'input' ? typedValue : '',
                outputValue: activeField === 'output' ? typedValue : '',
                error: null,
                fee: null,
                rate: null,
            };
        }

        try {
            const amount = parseAmount(typedValue);

            if (activeField === 'input') {
                const { outputAmount, fee, rate } = calculateSwapOutput(amount, inputCurrency, outputCurrency);
                return {
                    inputValue: typedValue,
                    outputValue: formatAmount(outputAmount, outputCurrency),
                    error: null,
                    fee,
                    rate,
                };
            } else {
                const { inputAmount, fee, rate } = calculateSwapInput(amount, inputCurrency, outputCurrency);
                return {
                    inputValue: formatAmount(inputAmount, inputCurrency),
                    outputValue: typedValue,
                    error: null,
                    fee,
                    rate,
                };
            }
        } catch {
            return {
                inputValue: activeField === 'input' ? typedValue : '',
                outputValue: activeField === 'output' ? typedValue : '',
                error: 'Calculation failed',
                fee: null,
                rate: null,
            };
        }
    }, [typedValue, activeField, inputCurrency, outputCurrency]);

    // Sync state to URL (skip initial render to avoid overwriting on mount)
    useEffect(() => {
        if (!isInitializedRef.current) {
            isInitializedRef.current = true;
            return;
        }

        const params = new URLSearchParams();
        params.set('from', inputCurrency);
        params.set('to', outputCurrency);
        if (typedValue) params.set('amount', typedValue);
        params.set('field', activeField);

        router.replace(`?${params.toString()}`, { scroll: false });
    }, [inputCurrency, outputCurrency, typedValue, activeField, router]);

    // Handlers for user interaction
    const handleInputType = (value: string) => {
        setTypedValue(value);
        setActiveField('input');
        triggerLoadingAnimation();
    };

    const handleOutputType = (value: string) => {
        setTypedValue(value);
        setActiveField('output');
        triggerLoadingAnimation();
    };

    // swap currency function
    const handleSwapCurrencies = () => {
        const newTypedValue = swapResult.outputValue.replace(/,/g, '');

        setInputCurrency(outputCurrency);
        setOutputCurrency(inputCurrency);
        setTypedValue(newTypedValue);
        setActiveField('input');
        triggerLoadingAnimation();
    };

    return {
        // State
        inputCurrency,
        outputCurrency,
        // Display values (derived)
        inputValue: activeField === 'input' ? typedValue : swapResult.inputValue,
        outputValue: activeField === 'output' ? typedValue : swapResult.outputValue,
        loading: isAnimating,
        error: swapResult.error,
        fee: swapResult.fee,
        rate: swapResult.rate,

        // Actions
        setInputCurrency,
        setOutputCurrency,
        handleInputType,
        handleOutputType,
        handleSwapCurrencies,
    };
}
