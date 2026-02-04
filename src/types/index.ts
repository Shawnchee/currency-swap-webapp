export type CurrencyCode =
    | 'USD' | 'HKD' | 'AUD' | 'MYR' | 'GBP'
    | 'EUR' | 'IDR' | 'NZD' | 'CNY' | 'CZK' | 'AED';

export interface Currency {
    code: CurrencyCode;
    name: string;
    symbol: string;
    decimals: number;
}
