import axios from 'axios';
import { authStorage } from '@/lib/authStorage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const LOGIN_URL = '/api/v1/auth/login';

/** Evento disparado quando uma chamada autenticada retorna 401, para que a
 * aplicação limpe a sessão e redirecione para a tela de login. */
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token && config.url !== LOGIN_URL) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data as { message?: string } | undefined;
      const message = data?.message ?? error.message;

      if (status === 401 && error.config?.url !== LOGIN_URL) {
        authStorage.clear();
        window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
      }

      const normalized = new Error(message);
      (normalized as Error & { status?: number }).status = status;
      return Promise.reject(normalized);
    }
    return Promise.reject(error);
  },
);
