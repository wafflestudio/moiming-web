import type {
  GuestsParams,
  GuestsResponse,
  JoinEventRequest,
  JoinEventResponse,
} from '@/types/events';
import apiClient from '../apiClient';

// 참여자 명단 (GET /api/events/:id/registrations)
export async function getGuests(id: string, params?: GuestsParams) {
  const response = await apiClient.get<GuestsResponse>(
    `/events/${id}/registrations`,
    { params }
  );

  return {
    data: response.data,
    status: response.status,
  };
}

// 참여 신청 (POST /api/events/:id/registrations)
export async function joinEvent(id: string, data: JoinEventRequest) {
  const response = await apiClient.post<JoinEventResponse>(
    `/events/${id}/registrations`,
    data
  );

  return {
    data: response.data,
    status: response.status,
  };
}
