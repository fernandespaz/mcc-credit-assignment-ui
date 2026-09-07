import type { LoginPayload, LoginResponse } from '@/domain/entities/Auth';

export interface IAuthRepository {
  login(payload: LoginPayload): Promise<LoginResponse>;
}
