import type {
  CreateEventRequest,
  EventDetailResponse,
  UpdateEventRequest,
  UpdateEventResponse,
} from '@/types/events';
import apiClient from '../apiClient';

// 일정 생성 (POST /api/events)
export async function createEvent(data: CreateEventRequest) {
  const response = await apiClient.post(`/events`, data);

  return {
    data: response.data,
    status: response.status,
  };
}

// 일정 상세 응답 (GET /api/events/:id)
export async function getEventDetail(id: string) {
  const response = await apiClient.get<EventDetailResponse>(`/events/${id}`);

  return {
    data: response.data,
    status: response.status,
  };
}

// 일정 수정 (PUT /api/events/:id)
export async function updateEvent(id: string, data: UpdateEventRequest) {
  const response = await apiClient.put<UpdateEventResponse>(
    `/events/${id}`,
    data
  );

  return {
    data: response.data,
    status: response.status,
  };
}

// 일정 삭제 (DELETE /api/events/:id)
export async function deleteEvent(id: string) {
  const response = await apiClient.delete(`/events/${id}`);

  return {
    status: response.status,
  };
}
