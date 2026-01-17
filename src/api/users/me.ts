import apiClient from '@/api/apiClient';
import type { GetMeResponse } from '@/types/users';

export default async function getMe(): Promise<GetMeResponse> {
  const response = await apiClient.get('/users/me');
  return response.data;
}
