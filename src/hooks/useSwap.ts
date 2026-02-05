'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CurrencyCode } from '@/types';
import { calculateSwapOutput, calculateSwapInput, formatAmount, parseAmount } from '@/lib/swap';
import { validateAmount, isValidCurrencyCode } from '@/lib/validation';

// Define types of swap state
interface SwapState {
    inputValue: string;
    outputValue: string;
    loading: boolean;
    error: string | null;
    fee: number | null;
    rate: number | null;
}

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

    // The derived state
    const [swapState, setSwapState] = useState<SwapState>({
        inputValue: '',
        outputValue: '',
        loading: false,
        error: null,
        fee: null,
        rate: null,
    });

    // Race Condition Handler (tracking current request)
    const abortControllerRef = useRef<AbortController | null>(null);

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
    };

    const handleOutputType = (value: string) => {
        setTypedValue(value);
        setActiveField('output');
    };

    // Reset state when user changes currencies or typed value in input/output fields
    useEffect(() => {
        // Skip if no value to calculate
        if (!typedValue || typedValue.trim() === '') {
            setSwapState({
                inputValue: '',
                outputValue: '',
                loading: false,
                error: null,
                fee: null,
                rate: null,
            });
            return;
        }

        // Validate before calculating
        const validation = validateAmount(typedValue);
        if (!validation.valid) {
            setSwapState(prev => ({
                ...prev,
                inputValue: activeField === 'input' ? typedValue : '',
                outputValue: activeField === 'output' ? typedValue : '',
                loading: false,
                error: null,
                rate: null,
            }));
            return;
        }

        // Abort previous calculation (race condition prevention - for prod, this is where we would abort previous api calls)
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        // Start calculation
        setSwapState(prev => ({ ...prev, loading: true, error: null }));

        // Debounce with 300ms delay (to mimic api call delay)
        const timeoutId = setTimeout(async () => {
            if (controller.signal.aborted) return;

            try {
                const amount = parseAmount(typedValue);
                let resultInput = '';
                let resultOutput = '';
                let resultFee = 0;
                let resultRate = 0;

                if (activeField === 'input') {
                    // User typing in input field (reactive calculation)
                    const { outputAmount, fee, rate } = calculateSwapOutput(amount, inputCurrency, outputCurrency);
                    resultInput = typedValue;
                    resultOutput = formatAmount(outputAmount, outputCurrency);
                    resultFee = fee;
                    resultRate = rate;
                } else {
                    // User typing in output field (reactive calculation)
                    const { inputAmount, fee, rate } = calculateSwapInput(amount, inputCurrency, outputCurrency);
                    resultInput = formatAmount(inputAmount, inputCurrency);
                    resultOutput = typedValue;
                    resultFee = fee;
                    resultRate = rate;
                }

                if (!controller.signal.aborted) {
                    setSwapState({
                        inputValue: resultInput,
                        outputValue: resultOutput,
                        loading: false,
                        error: null,
                        fee: resultFee,
                        rate: resultRate
                    });
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    setSwapState(prev => ({ ...prev, loading: false, error: 'Calculation failed' }));
                }
            }
        }, 300);

        // Cleaning up, aborting previous calculation and clearing timeout
        return () => {
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, [typedValue, activeField, inputCurrency, outputCurrency]);


    // swap currency function
    const handleSwapCurrencies = () => {
        setInputCurrency(outputCurrency);
        setOutputCurrency(inputCurrency);
    };

    return {
        // State
        inputCurrency,
        outputCurrency,
        // The display value
        inputValue: activeField === 'input' ? typedValue : swapState.inputValue,
        outputValue: activeField === 'output' ? typedValue : swapState.outputValue,
        loading: swapState.loading,
        error: swapState.error,
        fee: swapState.fee,
        rate: swapState.rate,

        // Actions
        setInputCurrency,
        setOutputCurrency,
        handleInputType,
        handleOutputType,
        handleSwapCurrencies,
    };
}
