import type { CreateReceivablePayload, PresentValueResult, Receivable } from '@/domain/entities/Receivable';
import type { IReceivableRepository } from '@/domain/ports/IReceivableRepository';
import { apiClient } from '@/infrastructure/http/apiClient';

const BASE = '/api/v1/receivables';

export class ReceivableHttpRepository implements IReceivableRepository {
  async findAll(): Promise<Receivable[]> {
    const { data } = await apiClient.get<Receivable[]>(BASE);
    return data;
  }

  async findById(id: string): Promise<Receivable> {
    const { data } = await apiClient.get<Receivable>(`${BASE}/${id}`);
    return data;
  }

  async findByAssignor(assignorId: string): Promise<Receivable[]> {
    const { data } = await apiClient.get<Receivable[]>(`${BASE}/by-assignor/${assignorId}`);
    return data;
  }

  async create(payload: CreateReceivablePayload): Promise<Receivable> {
    const { data } = await apiClient.post<Receivable>(BASE, payload);
    return data;
  }

  async simulate(id: string, baseRate: number): Promise<PresentValueResult> {
    const { data } = await apiClient.get<PresentValueResult>(`${BASE}/${id}/simulate`, {
      params: { baseRate },
    });
    return data;
  }
}

export const receivableRepository = new ReceivableHttpRepository();
