import { CurrencyCode } from '@/types';
import { EXCHANGE_RATES } from '@/lib/exchange_rates';

// Error codes for swap validation
export enum SwapErrorCode {
    INVALID_FORMAT = 'E001',
    ZERO_OR_NEGATIVE = 'E002',
}

// Validation result with error details
export interface ValidationResult {
    valid: boolean;
    error?: {
        code: SwapErrorCode;
        message: string;
    };
}

// Error message for client-side
export const ERROR_MESSAGES: Record<SwapErrorCode, string> = {
    [SwapErrorCode.INVALID_FORMAT]: 'Please enter a valid number (e.g., 67 or 67.50)',
    [SwapErrorCode.ZERO_OR_NEGATIVE]: 'Amount must be greater than zero',
};

// Get error message by code (for external use)
export function getErrorMessage(code: SwapErrorCode): string {
    return ERROR_MESSAGES[code];
}

// Regex helper function for validating amount input format
export function isValidAmountFormat(value: string): boolean {
    // Allow empty string or valid number format
    return value === '' || /^\d*\.?\d*$/.test(value);
}

// Validate currency code against known currencies
export function isValidCurrencyCode(code: string | null): code is CurrencyCode {
    return code !== null && code in EXCHANGE_RATES;
}

// Validate amount input format
export function validateAmount(value: string): ValidationResult {
    if (!isValidAmountFormat(value) || value === '' || value.trim() === '') {
        return {
            valid: false,
            error: {
                code: SwapErrorCode.INVALID_FORMAT,
                message: ERROR_MESSAGES[SwapErrorCode.INVALID_FORMAT],
            },
        };
    }

    const numValue = parseFloat(value);

    // Check if zero or negative
    if (isNaN(numValue) || numValue <= 0) {
        return {
            valid: false,
            error: {
                code: SwapErrorCode.ZERO_OR_NEGATIVE,
                message: ERROR_MESSAGES[SwapErrorCode.ZERO_OR_NEGATIVE],
            },
        };
    }

    return { valid: true };
}

// Format validation error for display
export function formatValidationError(result: ValidationResult): string | null {
    if (result.valid || !result.error) {
        return null;
    }
    return result.error.message;
}
