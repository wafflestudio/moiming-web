import type { MyEventsResponse } from '@/types/events';
import apiClient from '../apiClient';

// 내가 생성한 모임 목록 (GET /api/events/me)
export default async function getMyEvents(cursor?: string) {
  const response = await apiClient.get<MyEventsResponse>(`/events/me`, {
    params: { cursor },
  });

  return {
    data: response.data,
    status: response.status,
  };
}
