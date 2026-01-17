import type { User } from '@/types/user';

// ---------- /singup ----------

export interface SignUpRequest {
  email: string;
  name: string;
  password: string;
  profileImage?: string;
}

export type SignUpResponse = User;

// ---------- /logout ----------

export interface LogoutResponse {
  message: string;
}

// ---------- /login ----------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

// ---------- /social ----------

type AuthProvider = 'google' | 'kakao';

export interface SocialLoginRequest {
  provider: AuthProvider;
  code: string;
}

export interface SocialLoginResponse {
  token: string;
  user: User;
}
