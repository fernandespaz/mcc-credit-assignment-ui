import type { CreateReceivablePayload, PresentValueResult, Receivable } from '@/domain/entities/Receivable';

export interface IReceivableRepository {
  findAll(): Promise<Receivable[]>;
  findById(id: string): Promise<Receivable>;
  findByAssignor(assignorId: string): Promise<Receivable[]>;
  create(payload: CreateReceivablePayload): Promise<Receivable>;
  simulate(id: string, baseRate: number): Promise<PresentValueResult>;
}
