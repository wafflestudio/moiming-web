import apiClient from '@/api/apiClient';
import type { MyRegistrationsResponse } from '@/types/registrations';

// 내가 신청한 일정 조회 (GET /api/registrations/me)
export default async function getMyRegistrations(): Promise<MyRegistrationsResponse> {
  const response = await apiClient.get('/registrations/me');
  return response.data;
}
