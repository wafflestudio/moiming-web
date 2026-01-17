import apiClient from '@/api/apiClient';
import type { LogoutResponse } from '@/types/auth';

export default async function logout(): Promise<LogoutResponse> {
  const response = await apiClient.post<LogoutResponse>('/auth/logout');
  return response.data;
}
