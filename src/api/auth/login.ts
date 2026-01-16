import apiClient from '@/api/apiClient';
import type { LoginRequest, LoginResponse } from '@/types/auth';

export default async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', data);
  return response.data;
}
