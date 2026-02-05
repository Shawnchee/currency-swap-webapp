import { CurrencyCode, Currency } from '@/src/types/currency';

export const CURRENCIES: Record<CurrencyCode, Currency> = {
    USD: { code: 'USD', name: 'US Dollar', decimals: 2 },
    HKD: { code: 'HKD', name: 'Hong Kong Dollar', decimals: 2 },
    AUD: { code: 'AUD', name: 'Australian Dollar', decimals: 2 },
    MYR: { code: 'MYR', name: 'Malaysian Ringgit', decimals: 2 },
    GBP: { code: 'GBP', name: 'British Pound', decimals: 2 },
    EUR: { code: 'EUR', name: 'Euro', decimals: 2 },
    IDR: { code: 'IDR', name: 'Indonesian Rupiah', decimals: 6 },
    NZD: { code: 'NZD', name: 'New Zealand Dollar', decimals: 2 },
    CNY: { code: 'CNY', name: 'Chinese Yuan', decimals: 2 },
    CZK: { code: 'CZK', name: 'Czech Koruna', decimals: 2 },
    AED: { code: 'AED', name: 'UAE Dirham', decimals: 2 },
};

export function getAllCurrencies(): Currency[] {
    return Object.values(CURRENCIES);
}
