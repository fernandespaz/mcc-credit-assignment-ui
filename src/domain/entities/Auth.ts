export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresInMs: number;
  username: string;
  role: string;
}

export interface AuthUser {
  username: string;
  role: string;
}
