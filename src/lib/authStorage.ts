import type { AuthUser } from '@/domain/entities/Auth';

const TOKEN_KEY = 'credit_assignment_auth_token';
const USER_KEY = 'credit_assignment_auth_user';
const EXPIRY_KEY = 'credit_assignment_auth_expires_at';

export interface StoredSession {
  accessToken: string;
  user: AuthUser;
  expiresAt: number;
}

/**
 * Armazena a sessão de autenticação em sessionStorage.
 * O token é stateless e não há refresh token no backend, então a sessão
 * é limpa a cada expiração ou fechamento da aba (ver docs de auth do backend).
 */
export const authStorage = {
  get(): StoredSession | null {
    const accessToken = sessionStorage.getItem(TOKEN_KEY);
    const rawUser = sessionStorage.getItem(USER_KEY);
    const rawExpiresAt = sessionStorage.getItem(EXPIRY_KEY);

    if (!accessToken || !rawUser || !rawExpiresAt) {
      return null;
    }

    const expiresAt = Number(rawExpiresAt);
    if (Number.isNaN(expiresAt)) {
      return null;
    }

    try {
      const user = JSON.parse(rawUser) as AuthUser;
      return { accessToken, user, expiresAt };
    } catch {
      return null;
    }
  },

  set(session: StoredSession): void {
    sessionStorage.setItem(TOKEN_KEY, session.accessToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(session.user));
    sessionStorage.setItem(EXPIRY_KEY, String(session.expiresAt));
  },

  clear(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(EXPIRY_KEY);
  },

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  },
};
