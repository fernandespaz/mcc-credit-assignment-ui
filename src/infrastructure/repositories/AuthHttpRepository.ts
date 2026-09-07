import type { LoginPayload, LoginResponse } from '@/domain/entities/Auth';
import type { IAuthRepository } from '@/domain/ports/IAuthRepository';
import { apiClient } from '@/infrastructure/http/apiClient';

const BASE = '/api/v1/auth';

export class AuthHttpRepository implements IAuthRepository {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>(`${BASE}/login`, payload);
    return data;
  }
}

export const authRepository = new AuthHttpRepository();
