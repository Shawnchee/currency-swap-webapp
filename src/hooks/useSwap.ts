'use client';

import { useState, useEffect, useRef } from 'react';
import { CurrencyCode } from '@/types';
import { calculateSwapOutput, calculateSwapInput, formatAmount, parseAmount } from '@/lib/swap';
import { validateAmount, formatValidationError } from '@/lib/validation';

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
    const [inputCurrency, setInputCurrency] = useState<CurrencyCode>('USD');
    const [outputCurrency, setOutputCurrency] = useState<CurrencyCode>('MYR');

    const [typedValue, setTypedValue] = useState<string>('');
    const [activeField, setActiveField] = useState<'input' | 'output'>('input');

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

    // Handlers for user interaction
    const handleInputType = (value: string) => {
        setTypedValue(value);
        setActiveField('input');
    };

    const handleOutputType = (value: string) => {
        setTypedValue(value);
        setActiveField('output');
    };

    // Swap logic
    const executeSwap = async () => {
        // Validate input
        const validation = validateAmount(typedValue);

        if (!validation.valid) {
            const errorMessage = formatValidationError(validation);

            // how it work look like for dev debugging printouts
            // if (process.env.NODE_ENV === 'development' && validation.error) {
            //     console.log('[Validation Error]', {
            //         code: validation.error.code,
            //         message: validation.error.message,
            //     });
            // }

            setSwapState(prev => ({
                ...prev,
                error: errorMessage,
                loading: false,
            }));
            return;
        }

        // Prevent race condition by aborting previous calculations
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        // Loader for UX
        setSwapState(prev => ({ ...prev, loading: true, error: null }));

        try {
            // Simulate network delay for 'API' calls for demo purposes 
            await new Promise(resolve => setTimeout(resolve, 300));

            // Check if aborted during the delay
            if (controller.signal.aborted) return;

            const amount = parseAmount(typedValue);
            let resultInput = '';
            let resultOutput = '';
            let resultFee = 0;
            let resultRate = 0;

            if (activeField === 'input') {
                // active field is input, meaning user types inside input for swapping
                const { outputAmount, fee, rate } = calculateSwapOutput(amount, inputCurrency, outputCurrency);
                resultInput = typedValue;
                resultOutput = formatAmount(outputAmount, outputCurrency);
                resultFee = fee;
                resultRate = rate;
            } else {
                // active field is output, meaning user types inside output for swapping
                const { inputAmount, fee, rate } = calculateSwapInput(amount, inputCurrency, outputCurrency);
                resultInput = formatAmount(inputAmount, inputCurrency);
                resultOutput = typedValue;
                resultFee = fee;
                resultRate = rate;
            }

            setSwapState({
                inputValue: resultInput,
                outputValue: resultOutput,
                loading: false,
                error: null,
                fee: resultFee,
                rate: resultRate
            });

        } catch (err) {
            if (!controller.signal.aborted) {
                console.log("Error: ", err); // debugging printouts
                setSwapState(prev => ({ ...prev, loading: false, error: 'Calculation failed' }));
            }
        }
    };

    // Reset state when user changes currencies or typed value in input/output fields
    useEffect(() => {
        setSwapState(prev => ({
            ...prev,
            loading: false,
            error: null,
            fee: null,
            rate: null,
            inputValue: activeField === 'input' ? typedValue : '',
            outputValue: activeField === 'output' ? typedValue : ''
        }));
    }, [inputCurrency, outputCurrency, typedValue, activeField]);


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
        executeSwap,
    };
}
