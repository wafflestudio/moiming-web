import apiClient from '@/api/apiClient';
import type { GetMeResponse } from '@/types/users';

export default async function getMe(token?: string): Promise<GetMeResponse> {
  // token이 인자로 들어오면 헤더에 명시적으로 넣어주고, 없으면 인터셉터가 처리
  const response = await apiClient.get('/users/me', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}
