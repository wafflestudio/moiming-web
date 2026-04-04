import apiClient from '@/api/apiClient';
import type { MyRegistrationsResponse } from '@/types/registrations';

// 내가 신청한 모임 조회 (GET /api/registrations/me)
export default async function getMyRegistrations(
  page: number = 0,
  size: number = 5
): Promise<MyRegistrationsResponse> {
  const response = await apiClient.get<MyRegistrationsResponse>(
    '/registrations/me',
    {
      params: { page, size },
    }
  );
  return response.data;
}
