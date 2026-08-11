import type { Currency } from '@/domain/value-objects/enums';

export interface ExchangeRate {
  id: string;
  fromCurrency: Currency;
  toCurrency: Currency;
  rate: number;
  source: string;
  updatedAt: string;
}

export interface CreateExchangeRatePayload {
  fromCurrency: Currency;
  toCurrency: Currency;
  rate: number;
}

export interface UpdateExchangeRatePayload {
  fromCurrency: Currency;
  toCurrency: Currency;
  rate: number;
}
