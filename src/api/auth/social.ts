import type { AuthResponse, SocialLoginRequest } from '../../types/auth';
import apiClient from '../apiClient';

export default async function social(
  data: SocialLoginRequest
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/social', data);
  return response.data;
}
