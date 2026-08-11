import type { ExecuteSettlementPayload, Settlement } from '@/domain/entities/Settlement';
import type { ISettlementRepository } from '@/domain/ports/ISettlementRepository';
import { apiClient } from '@/infrastructure/http/apiClient';

const BASE = '/api/v1/settlements';

export class SettlementHttpRepository implements ISettlementRepository {
  async findById(id: string): Promise<Settlement> {
    const { data } = await apiClient.get<Settlement>(`${BASE}/${id}`);
    return data;
  }

  async findByReceivable(receivableId: string): Promise<Settlement[]> {
    const { data } = await apiClient.get<Settlement[]>(`${BASE}/by-receivable/${receivableId}`);
    return data;
  }

  async execute(payload: ExecuteSettlementPayload): Promise<Settlement> {
    const { data } = await apiClient.post<Settlement>(BASE, payload);
    return data;
  }
}

export const settlementRepository = new SettlementHttpRepository();
