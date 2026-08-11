import type { Currency } from '@/domain/value-objects/enums';
import type { CreateExchangeRatePayload, ExchangeRate, UpdateExchangeRatePayload } from '@/domain/entities/ExchangeRate';
import type { IExchangeRateRepository } from '@/domain/ports/IExchangeRateRepository';
import { apiClient } from '@/infrastructure/http/apiClient';

const BASE = '/api/v1/exchange-rates';

export class ExchangeRateHttpRepository implements IExchangeRateRepository {
  async findAll(): Promise<ExchangeRate[]> {
    const { data } = await apiClient.get<ExchangeRate[]>(BASE);
    return data;
  }

  async findById(id: string): Promise<ExchangeRate> {
    const { data } = await apiClient.get<ExchangeRate>(`${BASE}/${id}`);
    return data;
  }

  async findByPair(from: Currency, to: Currency): Promise<ExchangeRate> {
    const { data } = await apiClient.get<ExchangeRate>(`${BASE}/pair`, { params: { from, to } });
    return data;
  }

  async create(payload: CreateExchangeRatePayload): Promise<ExchangeRate> {
    const { data } = await apiClient.post<ExchangeRate>(BASE, payload);
    return data;
  }

  async update(id: string, payload: UpdateExchangeRatePayload): Promise<ExchangeRate> {
    const { data } = await apiClient.put<ExchangeRate>(`${BASE}/${id}`, payload);
    return data;
  }

  async syncMock(): Promise<ExchangeRate[]> {
    const { data } = await apiClient.post<ExchangeRate[]>(`${BASE}/sync-mock`);
    return data;
  }
}

export const exchangeRateRepository = new ExchangeRateHttpRepository();
