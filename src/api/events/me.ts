import type { MyEventsResponse } from '@/types/events';
import apiClient from '../apiClient';

// 내가 생성한 일정 목록 (GET /api/events/me)
export default async function getMyEvents() {
  const response = await apiClient.get<MyEventsResponse>(`/events/me`);

  return {
    data: response.data,
    status: response.status,
  };
}
