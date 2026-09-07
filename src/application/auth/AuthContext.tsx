import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { AuthUser } from '@/domain/entities/Auth';
import { authRepository } from '@/infrastructure/repositories/AuthHttpRepository';
import { authStorage } from '@/lib/authStorage';
import { AUTH_UNAUTHORIZED_EVENT } from '@/infrastructure/http/apiClient';

/** Margem de segurança antes do vencimento real do token para disparar o logout
 * automático e evitar 401s inesperados em pleno uso. */
const AUTO_LOGOUT_MARGIN_MS = 5_000;

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clearAutoLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = undefined;
    }
  }, []);

  const scheduleAutoLogout = useCallback(
    (expiresAt: number) => {
      clearAutoLogoutTimer();
      const msUntilExpiry = expiresAt - Date.now() - AUTO_LOGOUT_MARGIN_MS;

      if (msUntilExpiry <= 0) {
        authStorage.clear();
        setUser(null);
        return;
      }

      logoutTimerRef.current = setTimeout(() => {
        authStorage.clear();
        setUser(null);
      }, msUntilExpiry);
    },
    [clearAutoLogoutTimer],
  );

  useEffect(() => {
    const session = authStorage.get();
    if (session && session.expiresAt > Date.now()) {
      setUser(session.user);
      scheduleAutoLogout(session.expiresAt);
    } else {
      authStorage.clear();
    }
    setIsInitializing(false);
  }, [scheduleAutoLogout]);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAutoLogoutTimer();
      setUser(null);
    };
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [clearAutoLogoutTimer]);

  const login = useCallback(
    async (username: string, password: string) => {
      const response = await authRepository.login({ username, password });
      const expiresAt = Date.now() + response.expiresInMs;
      const loggedUser: AuthUser = { username: response.username, role: response.role };

      authStorage.set({ accessToken: response.accessToken, user: loggedUser, expiresAt });
      setUser(loggedUser);
      scheduleAutoLogout(expiresAt);
    },
    [scheduleAutoLogout],
  );

  const logout = useCallback(() => {
    clearAutoLogoutTimer();
    authStorage.clear();
    setUser(null);
  }, [clearAutoLogoutTimer]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: user !== null, isInitializing, login, logout }),
    [user, isInitializing, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
