import type { SocialLoginRequest, SocialLoginResponse } from '../../types/auth';
import apiClient from '../apiClient';

export default async function social(
  data: SocialLoginRequest
): Promise<SocialLoginResponse> {
  const response = await apiClient.post<SocialLoginResponse>(
    '/auth/social',
    data
  );
  return response.data;
}
