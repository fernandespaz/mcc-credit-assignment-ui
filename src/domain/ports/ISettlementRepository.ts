import type { ExecuteSettlementPayload, Settlement } from '@/domain/entities/Settlement';

export interface ISettlementRepository {
  findById(id: string): Promise<Settlement>;
  findByReceivable(receivableId: string): Promise<Settlement[]>;
  execute(payload: ExecuteSettlementPayload): Promise<Settlement>;
}
