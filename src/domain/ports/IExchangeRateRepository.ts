import type { Currency } from '@/domain/value-objects/enums';
import type { CreateExchangeRatePayload, ExchangeRate, UpdateExchangeRatePayload } from '@/domain/entities/ExchangeRate';

export interface IExchangeRateRepository {
  findAll(): Promise<ExchangeRate[]>;
  findById(id: string): Promise<ExchangeRate>;
  findByPair(from: Currency, to: Currency): Promise<ExchangeRate>;
  create(payload: CreateExchangeRatePayload): Promise<ExchangeRate>;
  update(id: string, payload: UpdateExchangeRatePayload): Promise<ExchangeRate>;
  syncMock(): Promise<ExchangeRate[]>;
}
