// ---------- /signup ----------

export interface SignUpRequest {
  email: string;
  name: string;
  password: string;
  profileImage?: string;
}

export type SignUpResponse = undefined;

export interface ApiError {
  errorCode: number;
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

// ---------- /logout ----------

export interface LogoutResponse {
  message: string;
}

// ---------- /social ----------

type AuthProvider = 'google' | 'kakao';

export interface SocialLoginRequest {
  provider: AuthProvider;
  code: string;
}

export interface SocialLoginResponse {
  token: string;
}
