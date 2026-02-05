// helper functions for currency swap

import { CurrencyCode } from '@/src/types/currency';
import { EXCHANGE_RATES } from '@/lib/exchange_rates';


// Getting the exchange rate from EXCHANGE_RATES
export function getExchangeRate(from: CurrencyCode, to: CurrencyCode): number {
    if (from === to) return 1;
    const fromRate = EXCHANGE_RATES[from];
    const toRate = EXCHANGE_RATES[to];
    return toRate / fromRate;
}


// Swapping function with 1% fee
export function calculateSwapOutput(
    inputAmount: number,
    fromCurrency: CurrencyCode,
    toCurrency: CurrencyCode
): { outputAmount: number; fee: number; rate: number } {
    const fee = inputAmount * 0.01;
    const amountAfterFee = inputAmount - fee;
    const rate = getExchangeRate(fromCurrency, toCurrency);
    const outputAmount = amountAfterFee * rate;

    return { outputAmount, fee, rate };
}


// Reversed swapping function with 1% fee
export function calculateSwapInput(
    outputAmount: number,
    fromCurrency: CurrencyCode,
    toCurrency: CurrencyCode
): { inputAmount: number; fee: number; rate: number } {
    const rate = getExchangeRate(fromCurrency, toCurrency);
    const amountBeforeFee = outputAmount / rate;
    const inputAmount = amountBeforeFee / 0.99;
    const fee = inputAmount * 0.01;

    return { inputAmount, fee, rate };
}

// Format number for display with dynamic precision
export function formatAmount(amount: number, currencyCode: CurrencyCode): string {
    if (amount === 0) return '0.00';

    // Get currency metadata
    const { CURRENCIES } = require('@/lib/api');
    const currency = CURRENCIES[currencyCode];

    if (currency?.decimals === 0) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    }

    // Dynamic precision based on amount size
    let maxDecimals = 2;
    let minDecimals = 2;

    if (amount < 0.01) {
        // Show up to 6 decimals (tiny amounts)
        maxDecimals = 6;
        minDecimals = 2;
    } else if (amount < 1) {
        // Show up to 4 decimals (small amounts)
        maxDecimals = 4;
        minDecimals = 2;
    }

    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: minDecimals,
        maximumFractionDigits: maxDecimals,
    }).format(amount);
}

// Parse user input to number
export function parseAmount(value: string): number {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
}