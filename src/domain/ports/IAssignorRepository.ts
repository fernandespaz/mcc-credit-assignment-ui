import type { Assignor, CreateAssignorPayload, UpdateAssignorPayload } from '@/domain/entities/Assignor';

export interface IAssignorRepository {
  findAll(): Promise<Assignor[]>;
  findById(id: string): Promise<Assignor>;
  create(payload: CreateAssignorPayload): Promise<Assignor>;
  update(id: string, payload: UpdateAssignorPayload): Promise<Assignor>;
  deactivate(id: string): Promise<void>;
}
