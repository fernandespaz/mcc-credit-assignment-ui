import type { Assignor, CreateAssignorPayload, UpdateAssignorPayload } from '@/domain/entities/Assignor';
import type { IAssignorRepository } from '@/domain/ports/IAssignorRepository';
import { apiClient } from '@/infrastructure/http/apiClient';

const BASE = '/api/v1/assignors';

export class AssignorHttpRepository implements IAssignorRepository {
  async findAll(): Promise<Assignor[]> {
    const { data } = await apiClient.get<Assignor[]>(BASE);
    return data;
  }

  async findById(id: string): Promise<Assignor> {
    const { data } = await apiClient.get<Assignor>(`${BASE}/${id}`);
    return data;
  }

  async create(payload: CreateAssignorPayload): Promise<Assignor> {
    const { data } = await apiClient.post<Assignor>(BASE, payload);
    return data;
  }

  async update(id: string, payload: UpdateAssignorPayload): Promise<Assignor> {
    const { data } = await apiClient.patch<Assignor>(`${BASE}/${id}`, payload);
    return data;
  }

  async deactivate(id: string): Promise<void> {
    await apiClient.delete(`${BASE}/${id}`);
  }
}

export const assignorRepository = new AssignorHttpRepository();
